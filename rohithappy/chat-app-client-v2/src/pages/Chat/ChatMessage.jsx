import PropTypes from 'prop-types';
import { forwardRef, useRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import Avatar from '../../components/Avatar';
import { useAuthContext } from '../../context/AuthContext';
import { useChatContext } from '../../context/ChatContext';
import { timeFormatter } from '../../utils/timeFormatter';
import { useState } from 'react';
import { useAxios } from '../../hooks/useAxios';
import { chatAPI } from '../../api';

const ChatMessage = forwardRef(function ChatMessage({ sender, avatarImage, _id, message, updatedAt, readers }, ref) {
  const { user } = useAuthContext();
  const { chatInfo } = useChatContext();
  const messageRef = useRef(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        scrollIntoView() {
          messageRef.current.scrollIntoView({
            behavior: 'smooth'
          });
        }
      };
    },
    []
  );

  const fromSelf = user._id === sender;
  const isRoom = chatInfo.chatType === 'room';

  var msgg = "";
  var fe = [
    ".txt", ".docx", ".xlsx", ".pptx", ".pdf", ".jpg", ".jpeg", ".png", ".gif",
    ".mp3", ".mp4", ".avi", ".html", ".css", ".js", ".zip", ".rar", ".tar.gz",
    ".exe", ".dll", ".iso"
  ]

  for(let i = 0; i < fe.length; i++) {
     if(message.includes(fe[i])) {
       msgg = <a href="#">{message}</a>
     } else {
       msgg = message
     }
  }
  const [test, setTest] = useState(true);
  const { sendRequest: postUserMessage } = useAxios();
 
  function delle() {
    /* postUserMessage(
      {
        method: 'PUT',
        url: chatAPI.postUserMessage({
          userId: user._id,
          chatId,
          type: chatInfo.chatType
        }),
        data: {
          message: ''
        }
      },
      (data) => {
         console.log(data)
      }
    ); */
     setTest(false);
  }
  
  return (
(test) ? (
    <Message className={fromSelf ? 'self' : null} ref={messageRef}>
      <button style={{height:'100%'}} onClick={delle}>delete</button>
      <Avatar size="medium" src={`data:image/svg+xml;base64,${avatarImage}`} />
      <Text className={fromSelf ? 'self' : null}>{
      (message.includes('.')) ?  <a id="srr" style={{color:'#f0f'}} href="http://localhost:5000/data">{(test) ? message : ''}</a> : (test) ? message:''
      }</Text>
      <MessageDetail>
        {readers.length > 0 && fromSelf && <Status>Read {isRoom && readers.length}</Status>}
        <Time>{timeFormatter(updatedAt)}</Time>
      </MessageDetail>
    </Message>
   )
: (
   ''
)
  );
});

ChatMessage.propTypes = {
  sender: PropTypes.string.isRequired,
  avatarImage: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  readers: PropTypes.array.isRequired
};

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 1.5rem 0;

  &.self {
    flex-direction: row-reverse;
    align-self: flex-end;
  }
`;

const Text = styled.p`
  padding: 1rem 1rem;
  margin-left: 0.5rem;
  background-color: var(--bg-color-darken);
  border-radius: 20px;
  border-top-left-radius: 4px;
  max-width: 55%;
  font-weight: 400;

  &.self {
    border-top-right-radius: 4px;
    border-top-left-radius: 20px;
    background-color: var(--secondary);
    color: ${(props) => (props.theme.mode === 'light' ? 'var(--bg-color-main)' : 'var(--main-color)')};
  }
`;

const MessageDetail = styled.div`
  align-self: flex-end;
  color: var(--main-color);
`;

const Status = styled.span`
  font-size: 0.75rem;
  text-transform: capitalize;
  font-weight: 400;
`;

const Time = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 4px;
`;

const Mc = styled.div`
  color: #f0f;
`;

export default ChatMessage;
