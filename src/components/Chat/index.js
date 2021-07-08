import _                  from 'lodash';
import ApiConstants       from '../../constants/Api';
import Icon               from '../Icon';
import IconTheme          from '../Icon/IconTheme';
import IconType           from '../../components/Icon/IconType';
import styles             from './styles.module.scss';
import { connect }        from 'react-redux';
import { useEffect }      from 'react';
import { UserActions }    from '../../store/actions/user';
import { ChatActions }    from '../../store/actions/chat';
import { useRef }         from 'react';
import { useState }       from 'react';
import Input              from '../Input';
import classNames         from 'classnames';
import { io }             from 'socket.io-client';
import ChatMessageWrapper from '../ChatMessageWrapper';
import ChatMessageType    from '../ChatMessageWrapper/ChatMessageType';
const sortChatMessages = (chatMessages) => chatMessages.sort((a={},b={}) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return aDate < bDate ? -1 : aDate === bDate ? 0 : 1;
});
const Chat = ({ className, token, userId, event, fetchUser, messages, fetchChatMessages, addChatMessage }) => {
    // @TODO: move those websocket things to redux-saga in an eventChannel
    const websocket                       = useRef(null);
    const messageListRef                  = useRef();
    const [message, setMessage]           = useState('');
    const chatMessages = sortChatMessages(messages);
    const eventId =  _.get(event, '_id');
    const createSocket = () => {
        const socket = io(
            ApiConstants.getBackendSocketUrl(),
            {
                query:        `token=${token}`,
                extraHeaders: { Authorization: `Bearer ${token}` },
            },
        );

        return socket;
    };

    const getCurrentSocket = () => {
        return websocket.current;
    };

    const setCurrentSocket = (socket) => {
        websocket.current = socket;
    };

    const getMessageIdObject = () => {
        return {
            eventId,
            userId,
        };
    };
    useEffect(() => {
        if(eventId) {
            fetchChatMessages(eventId);
        }
    }, [eventId, fetchChatMessages]);

    useEffect(
        () => {
            const createdSocket = createSocket();
            setCurrentSocket(createdSocket);
            messageListScrollToBottom();

            createdSocket.on('connect', () => {
                sendJoinRoom();
            });
            createdSocket.on('chatMessage', data => {
                const userId  = data.userId;
                const message = _.pick(data,['message', 'date', 'eventId', 'userId']);
                fetchUser(userId);
                addNewMessage(message);
            });

            createdSocket.on('betCreated', data => {
                addBetCreated(data);
            });

            createdSocket.on('betPlaced', data => {
                addNewBetPlace(data);
            });

            createdSocket.on('betPulledOut', data => {
                addNewBetPullOut(data);
            });
            return () => {
                createdSocket.off('chatMessage');
                console.log('unmount')
                sendLeaveRoom();
                getCurrentSocket()?.disconnect()
                setCurrentSocket()
            }
        // we want that to run only once
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    );
    useEffect(
        () => {
            messageListScrollToBottom();
        }, [messages]
    );

    const sendJoinRoom = () => {
        sendObject('joinRoom', getMessageIdObject());
    };

    const sendLeaveRoom = () => {
        sendObject('leaveRoom', getMessageIdObject());
    };

    const sendObject = (eventName, data) => {
        getCurrentSocket().emit(eventName, data);
    };

    const onMessageSend = () => {
        if (message) {
            const messageData = {
                type: ChatMessageType.chatMessage,
                message: message,
                date: new Date(),
                ...getMessageIdObject(),
            };

            sendObject('chatMessage', messageData);
            setMessage('');
        }
    };

    const addNewMessage = (message) => {
        const chatMessage = {
            type: ChatMessageType.chatMessage,
            ...message,
        };

        addChatMessage(chatMessage);
    };

    const addBetCreated = (betCreateData) => {
        const chatMessage = {
            type: ChatMessageType.createBet,
            ...betCreateData,
        };
        const userId      = _.get(betCreateData, 'userId');

        if (userId) {
            fetchUser(userId);
        }

        addChatMessage(chatMessage);
    };

    const addNewBetPlace = (betPlaceData) => {
        const chatMessage = {
            type: ChatMessageType.placeBet,
            ...betPlaceData,
        };
        const userId      = _.get(betPlaceData, 'userId');

        if (userId) {
            fetchUser(userId);
        }

        addChatMessage(chatMessage);
    };

    const addNewBetPullOut = (betPulloutData) => {
        const chatMessage = {
            type: ChatMessageType.pulloutBet,
            ...betPulloutData,
        };
        const userId      = _.get(betPulloutData, 'userId');

        if (userId) {
            fetchUser(userId);
        }

        addChatMessage(chatMessage);
    };

    const renderMessages = () => {
        return _.map(
            chatMessages,
            (chatMessage, index) => {
                const userId = _.get(chatMessage, 'userId');
                const date   = _.get(chatMessage, 'date');

                return <ChatMessageWrapper
                    key={index}
                    message={chatMessage}
                    userId={userId}
                    date={date}
                />;
            },
        );
    };

    const messageListScrollToBottom = () => {
        if (messageListRef) {
            messageListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <div
            className={classNames(
                styles.chatContainer,
                className,
            )}
        >
            <div className={styles.messageContainer}>
                {renderMessages()}
                <span ref={messageListRef}>
                </span>
            </div>
            <div className={styles.messageContainerRunOut}>
            </div>
            <div className={styles.messageInput}>
                <Input
                    type={'text'}
                    placeholder={'Comment...'}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onSubmit={onMessageSend}
                />
                <button
                    type={'submit'}
                    onClick={onMessageSend}
                >
                    <Icon
                        iconType={IconType.chat}
                        iconTheme={IconTheme.primary}
                    />
                </button>
            </div>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        token: state.authentication.token,
        userId: state.authentication.userId,
        messages: state.chat.messagesByEvent[_.get(ownProps.event, '_id')] || []
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const eventId = _.get(ownProps.event, '_id');
    return {
        fetchUser: (userId) => {
            dispatch(UserActions.fetch({ userId }));
        },
        fetchChatMessages: (eventId) => {
            dispatch(ChatActions.fetch({ eventId }));
        },
        addChatMessage: (message) => {
            console.log('adding message')
            dispatch(ChatActions.addMessage({ eventId, message }));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Chat);
