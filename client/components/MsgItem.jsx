import PropTypes from "prop-types";
import MsgInput from "./MsgInput";

const MsgItem = ({
  id,
  userId,
  timestamp,
  text,
  onUpdate,
  onDelete,
  isEditing,
  startEdit,
}) => {
  return (
    <li className="messages__item">
      <h3>
        {userId}{" "}
        <sub>
          {new Date(timestamp).toLocaleString("ko-KR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </sub>
      </h3>
      {isEditing ? (
        <>
          <MsgInput mutate={onUpdate} id={id} />
        </>
      ) : (
        text
      )}

      <div className="messages__buttons">
        <button onClick={startEdit}>수정</button>
        <button onClick={onDelete}>삭제</button>
      </div>
    </li>
  );
};

MsgItem.propTypes = {
  id: PropTypes.number,
  userId: PropTypes.string,
  timestamp: PropTypes.number,
  text: PropTypes.string,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  isEditing: PropTypes.bool,
  startEdit: PropTypes.func,
};

export default MsgItem;
