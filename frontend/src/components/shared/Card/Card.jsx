import CardStyle from "./Card.module.css";

function Card({ heading, icon, alt, children }) {
  return (
    <div className={`${CardStyle.cardContainer}`}>
      <div className={`${CardStyle.cardHeading} flex-center`}>
        <img src={process.env.PUBLIC_URL + `./images/${icon}`} alt={alt} />
        <span>{heading}</span>
      </div>
      {children}
    </div>
  );
}

export default Card;
