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
  myId,
  user,
}) => {
  return (
    <li className="messages__item">
      <h3>
        {user.nickname}{" "}
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
      {/* query string으로 받아온 myId 가 userId와 같을 때만 수정/삭제 가능 */}
      {myId === userId && (
        <div className="messages__buttons">
          <button onClick={startEdit}>수정</button>
          <button onClick={onDelete}>삭제</button>
        </div>
      )}
    </li>
  );
};

MsgItem.propTypes = {
  id: PropTypes.string,
  userId: PropTypes.string,
  timestamp: PropTypes.number,
  text: PropTypes.string,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  isEditing: PropTypes.bool,
  startEdit: PropTypes.func,
  myId: PropTypes.string,
  user: PropTypes.string,
};

export default MsgItem;
