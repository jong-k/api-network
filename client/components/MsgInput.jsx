import { useRef } from "react";
import PropTypes from "prop-types";

const MsgInput = ({ mutate, text, id }) => {
  const textRef = useRef(null); // 텍스트 수정을 ref 객체로 핸들링

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = textRef.current.value;
    textRef.current.value = "";
    mutate(text, id);
  };

  return (
    <form className="messages__input" onSubmit={onSubmit}>
      <textarea
        ref={textRef}
        defaultValue={text}
        placeholder="내용을 입력하세요."
      />
      <button type="submit">완료</button>
    </form>
  );
};

MsgInput.defaultProps = {
  text: "",
  id: undefined,
};

MsgInput.propTypes = {
  mutate: PropTypes.func,
  text: PropTypes.string,
  id: PropTypes.number,
};

export default MsgInput;
