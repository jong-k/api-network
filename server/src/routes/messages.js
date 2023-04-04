import { v4 } from "uuid";
import { readDB, writeDB } from "../dbController.js";

const getMsgs = () => readDB("messages");
const setMsgs = (data) => writeDB("messages", data);

const messagesRoute = [
  {
    // GET : 모든 메시지
    method: "get",
    route: "/messages",
    handler: (req, res) => {
      const msgs = getMsgs();
      res.send(msgs);
    },
  },
  {
    // GET : 하나의 메시지
    method: "get",
    route: "/messages/:id",
    handler: ({ params: { id } }, res) => {
      try {
        const msgs = getMsgs();
        const msg = msgs.find((msg) => msg.id === id);
        if (!msg) throw Error("사용자가 없습니다.");
        res.send(msg);
      } catch (err) {
        // 요청을 찾을 수 없음
        res.status(404).send({ error: err });
      }
    },
  },
  {
    // POST : 새 메시지
    method: "post",
    route: "/messages",
    handler: ({ body }, res) => {
      const msgs = getMsgs();
      const newMsgs = {
        id: v4(),
        text: body.text,
        userId: body.userId,
        timestamp: Date.now(),
      };
      msgs.unshift(newMsgs);
      setMsgs(newMsgs);
      res.send(newMsgs); // 응답 : 생성한 아이템 1개
    },
  },
  {
    // PUT : 메시지 수정
    method: "put",
    route: "/messages/:id",
    handler: ({ body, params: { id } }, res) => {
      try {
        const msgs = getMsgs();
        const targetIndex = msgs.findIndex((msg) => msg.id === id);
        if (targetIndex < 0) throw Error("메시지가 없습니다.");
        if (msgs[targetIndex].userId !== body.userId)
          throw Error("사용자가 다릅니다.");

        const newMsg = { ...msgs[targetIndex], text: body.text };
        msgs.splice(targetIndex, 1, newMsg);
        setMsgs(msgs);
        res.send(newMsg);
      } catch (err) {
        // 서버 에러
        res.status(500).send({ error: err });
      }
    },
  },
  {
    // DELETE : 메시지 삭제
    method: "delete",
    route: "/messages/:id",
    handler: ({ body, params: { id } }, res) => {
      try {
        const msgs = getMsgs();
        const targetIndex = msgs.findIndex((msg) => msg.id === id);
        if (targetIndex < 0) throw Error("메시지가 없습니다.");
        if (msgs[targetIndex].userId !== body.userId)
          throw Error("사용자가 다릅니다.");

        const deletedMsg = msgs[targetIndex];
        msgs.splice(targetIndex, 1);
        setMsgs(msgs);
        res.send(deletedMsg);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
];

export default messagesRoute;
