import MsgList from "../components/MsgList";
import fetcher from "../fetcher";
import PropTypes from "prop-types";

export default function Home({ serverMsgs, users }) {
  return (
    <div>
      <h1>simple sns</h1>
      <MsgList serverMsgs={serverMsgs} users={users} />
    </div>
  );
}

export async function getServerSideProps() {
  const serverMsgs = await fetcher("get", "/messages");
  const users = await fetcher("get", "/users");
  return {
    props: { serverMsgs, users },
  };
}

Home.propTypes = {
  serverMsgs: PropTypes.array,
  users: PropTypes.object,
};
