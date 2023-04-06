import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import fetcher from "../fetcher";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const MsgList = () => {
  // url/?userId="___" 형태로 빈칸에 userId querystring을 받아와줌
  const { query } = useRouter();
  // url에서 /?userId 혹은 /?userid 둘다 가능하게 설정
  const userId = query.userId || query.userid || "";
  const [msgs, setMsgs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  // 새 메시지 생성
  const onCreate = async (text) => {
    const newMsg = await fetcher("post", "/messages", {
      text,
      userId,
    });
    if (!newMsg) throw Error("수정할 데이터가 정확하지 않습니다.");
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  // 메시지 수정
  const onUpdate = async (text, id) => {
    const newMsg = await fetcher("put", `/messages/${id}`, {
      text,
      userId,
    });
    if (!newMsg) throw Error("수정할 데이터가 정확하지 않습니다.");
    setMsgs((msgs) => {
      const targetIdx = msgs.findIndex((msg) => msg.id === id);
      if (targetIdx < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIdx, 1, newMsg);
      return newMsgs;
    });
    doneEdit();
  };

  // 메시지 삭제
  const onDelete = async (id) => {
    // 서버에서는 삭제된 데이터 전체 응답하지만, 구조분해할당으로 id만 꺼내서 사용
    const deletedMsg = await fetcher("delete", `/messages/${id}`, {
      params: { userId },
    });
    setMsgs((msgs) => {
      const targetIdx = msgs.findIndex((msg) => msg.id === deletedMsg.id + "");
      if (targetIdx < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIdx, 1);
      return newMsgs;
    });
  };

  // 편집할 아이템을 비움
  const doneEdit = () => setEditingId(null);

  // data fetching
  const getMsgs = async () => {
    const newMsgs = await fetcher("get", "/messages", {
      params: {
        // 맨 마지막 msg의 아이디
        // 데이터 적재된게 없으면 빈값일 수 있음
        cursor: msgs[msgs.length - 1]?.id || "",
      },
    });
    if (!newMsgs.length) {
      setHasNext(false);
      return;
    }
    setMsgs((msgs) => [...msgs, ...newMsgs]);
  };

  // 한 번은 실행되므로 최초 fetching 기능도 실행
  useEffect(() => {
    if (intersecting && hasNext) getMsgs();
  }, [intersecting]);

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs.length &&
          msgs.map((row) => (
            <MsgItem
              key={row.id}
              {...row}
              onUpdate={onUpdate}
              onDelete={() => onDelete(row.id)}
              isEditing={editingId === row.id}
              startEdit={() => setEditingId(row.id)}
              myId={userId}
            />
          ))}
      </ul>
      <div ref={fetchMoreEl}></div>
    </>
  );
};

export default MsgList;
