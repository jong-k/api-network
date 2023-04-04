import { useState } from "react";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";

// 랜덤한 유저 아이디를 부여
const USER_IDS = ["손흥민", "김민재", "이강인"];
const getRandomUserId = () => USER_IDS[Math.round(Math.random() * 2)];

// mock data
const originalMsgs = Array(50)
  .fill(0)
  .map((_, i) => ({
    id: 50 - i,
    userId: getRandomUserId(),
    timestamp: 1680517894123 + (50 - i) * 1000 * 60, // 대충 Date.now() 치면 나오는 숫자에 ms, s 보정값을 규칙적으로 더해줌
    text: `${50 - i} mock text`,
  }));

const MsgList = () => {
  const [msgs, setMsgs] = useState(originalMsgs);
  const [editingId, setEditingId] = useState(null);

  // 새 메시지 생성
  const onCreate = (text) => {
    const newMsg = {
      id: msgs.length + 1,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text: `${msgs.length + 1} ${text}`,
    };
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  // 메시지 수정
  const onUpdate = (text, id) => {
    setMsgs((msgs) => {
      const targetIdx = msgs.findIndex((msg) => msg.id === id);
      if (targetIdx < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIdx, 1, {
        ...msgs[targetIdx],
        text,
      });
      return newMsgs;
    });
    doneEdit();
  };

  // 메시지 삭제
  const onDelete = (id) => {
    setMsgs((msgs) => {
      const targetIdx = msgs.findIndex((msg) => msg.id === id);
      if (targetIdx < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIdx, 1);
      return newMsgs;
    });
  };

  // 편집할 아이템을 비움
  const doneEdit = () => setEditingId(null);

  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className="messages">
        {msgs.map((row) => (
          <MsgItem
            key={row.id}
            {...row}
            onUpdate={onUpdate}
            onDelete={() => onDelete(row.id)}
            isEditing={editingId === row.id}
            startEdit={() => setEditingId(row.id)}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
