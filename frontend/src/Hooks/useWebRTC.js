import { useEffect, useRef, useCallback } from "react";
import { socketInit } from "../socket/index";
import { useStateWithCallback } from "./useStateWithCallback";
import { ACTIONS } from "../actions";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);
  const clientsRef = useRef([]);

  // **************************************************
  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client.id === newClient.id);
      if (lookingFor === undefined) {
        setClients((existingClient) => [...existingClient, newClient], cb);
      }
    },
    [clients, setClients]
  );
  // ***********************************************
  useEffect(() => {
    const initChat = async () => {
      socket.current = socketInit();

      const captureMedia = async () => {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      };
      const handleNewPeer = async ({
        peerId,
        createOffer,
        user: remoteUser,
      }) => {
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
      const handleRemovePEER = async ({ peerId, userId }) => {
        if (connections.current[peerId]) {
          connections.current[peerId].close();
        }

        delete connections.current[peerId];
        delete audioElements.current[peerId];

        setClients((list) => list.filter((client) => client.id !== userId));
      };
      const handleIceCandidate = ({ peerId, icecandidate }) => {
        if (icecandidate) {
          connections.current[peerId].addIceCandidate(icecandidate);
        }
      };
      const setRemoteMedia = async ({ peerId, sessionDescription }) => {
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

      // ***************************************************
      await captureMedia();
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
        // ========= socket emit join socket.io ========
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
      // ************************************************
      socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
      socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePEER);
      socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
      socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
      socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
        setMute(true, userId);
      });
      socket.current.on(ACTIONS.UN_MUTE, ({ peerId, userId }) => {
        setMute(false, userId);
      });
    };
    initChat();
    // ************************************************
    return () => {
      localMediaStream.current.getTracks().forEach((track) => track.stop());
      socket.current.emit(ACTIONS.LEAVE, { roomId });
      for (let peerId in connections.current) {
        connections.current[peerId].close();
        delete connections.current[peerId];
        delete audioElements.current[peerId];
      }
      socket.current.off(ACTIONS.ADD_PEER);
      socket.current.off(ACTIONS.REMOVE_PEER);
      socket.current.off(ACTIONS.ICE_CANDIDATE);
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
      socket.current.off(ACTIONS.MUTE);
      socket.current.off(ACTIONS.UN_MUTE);
    };
  }, []);

  // ======== Listen for mute or unmute=============
  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);
  // ***************************************************
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };
  // *****************************************************
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
