import { useEffect, useRef, useCallback } from "react";
import { socketInit } from "../socket/index";
import { useStateWithCallback } from "./useStateWithCallback";
import { ACTIONS } from "../actions";
import freeice from "freeice";
// const freeice = require("freeice");
// console.log(freeice());

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  // console.log(clients, setClients);
  // console.log(roomId, user);
  // console.log(socketInit);

  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);
  const clientsRef = useRef([]);

  // ***************************************************
  // ========================================
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
    // console.log(userId, instance);
  };
  // ***************************************************

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client.id === newClient.id);
      if (lookingFor === undefined) {
        setClients((existingClient) => [...existingClient, newClient], cb);
      }
    },
    [clients, setClients]
  );
  // *****************************************************************************************
  useEffect(() => {
    socket.current = socketInit();
    // console.log(socket.current.emit);
  }, []);
  // *****************************************************************************************
  // *****************************************************************************************
  // capture media
  useEffect(() => {
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };

    startCapture().then(() => {
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
        // ========= socket emit join socket.io ========
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });
    return () => {
      // leaving the room
      localMediaStream.current.getTracks().forEach((track) => track.stop());

      socket.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, []);
  // *****************************************************************************************
  // *****************************************************************************************
  useEffect(() => {
    // peerId - remote user socketId
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      //  if already connected then give warning
      if (peerId in connections.current) {
        // connections = { socketId : connection}
        return console.warn(
          `You are already connected with ${peerId} and ${user.name}`
        );
      }

      // else add peer in connection
      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      // handle new ice candidate
      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: event.candidate,
        });
      };

      // Handle on track on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          if (audioElements.current[remoteUser.id]) {
            audioElements.current[remoteUser.id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser.id]) {
                audioElements.current[remoteUser.id].srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 1000);
          }
        });
      };

      // add local tracks to remote connection
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });

      // create offer
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();

        await connections.current[peerId].setLocalDescription(offer);
        // send offer to another client
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    // ==========================
    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, []);
  // *****************************************************************************************
  // *****************************************************************************************
  // handle icecandidate
  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      // console.log(icecandidate);
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });

    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);
  // *****************************************************************************************
  // *****************************************************************************************
  // handle sdp
  useEffect(() => {
    const handleRemoteSdp = async ({ peerId, sessionDescription }) => {
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(sessionDescription)
      );

      //  check session description type - offer or an answer then create according to that

      if (sessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();
        connection.setLocalDescription(answer);

        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };

    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);
  // *****************************************************************************************
  // *****************************************************************************************
  // handle remove peer
  useEffect(() => {
    const handleRemovePEER = async ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }

      delete connections.current[peerId];
      delete audioElements.current[peerId];

      setClients((list) => list.filter((client) => client.id !== userId));
    };

    // ============================================
    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePEER);

    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);

  // ======== Listen for mute or unmute=============

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);
  // ---------------------------------------
  useEffect(() => {
    const setMute = (mute, userId) => {
      const clientIdx = clientsRef.current
        .map((client) => client.id)
        .indexOf(userId);

      const connectedClients = [...clientsRef.current];

      if (clientIdx > -1) {
        connectedClients[clientIdx].muted = mute;
        setClients(connectedClients);
      }
    };
    // ---------------------------------
    socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
      setMute(true, userId);
    });
    // ------------------------------------
    socket.current.on(ACTIONS.UN_MUTE, ({ peerId, userId }) => {
      setMute(false, userId);
    });
  }, []);

  // ==========================================
  const handleMute = (isMute, userId) => {
    let settled = false;
    let interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = !isMute;
        if (isMute) {
          socket.current.emit(ACTIONS.MUTE, { roomId, userId });
        } else {
          socket.current.emit(ACTIONS.UN_MUTE, { roomId, userId });
        }
        settled = true;
      }
      if (settled) {
        clearInterval(interval);
      }
    }, 200);
  };

  return [clients, provideRef, handleMute, setClients];
};
