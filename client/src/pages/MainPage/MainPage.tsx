import styled from "styled-components";
import {observer} from "mobx-react-lite";
import {useUserStore} from "../../stores/userStore";
import useSubscribeUser from "../../hooks/useSubscribeUser";
import CreateChatModal from "../../components/CreateChatModal";
import FunctionsSideBar from "../../components/FunctionsSideBar";
import LeftColumn from "../../components/LeftColumn";
import MainColumn from "../../components/MainColumn";


const Container = styled.div`
  display: grid;
  grid-template-columns: 340px auto;
  grid-template-rows: 100vh;
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.primaryBg};
  transition: background-color 0.4s;
  overflow: hidden;
`

const MainPage = observer(() => {
    const {me} = useUserStore();

    if (!me) {
        return null;
    }

    useSubscribeUser(me.id);

    return (
        <>
            <FunctionsSideBar/>
            <CreateChatModal/>
            <Container>
                <LeftColumn/>
                <MainColumn/>
            </Container>
        </>
    );
});

export default MainPage;
