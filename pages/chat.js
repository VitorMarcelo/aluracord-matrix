import { Box, Text, TextField, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";
import { MessageList } from "../src/components/MessageList";


const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQwNTE2MCwiZXhwIjoxOTU4OTgxMTYwfQ.kTVm7rHS1Pfg721Vz7o3FezZPBssnlJolwX_LRWWxeg';
const SUPABASE_URL = 'https://psphkiqwgsqipzdaygpb.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function listenMessagesRealTime(addMessage) {
    return supabaseClient
                .from('mensagens')
                .on('INSERT', (message) => {
                    addMessage(message.new);
                })
                .subscribe();

}

export default function ChatPage() {
    const router = useRouter();
    const logedUser = router.query.username;
    const [message, setMessage] = React.useState('');
    const [messageList, setMessageList] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
                .from('mensagens')
                .select('*')
                .order('id', {ascending: false})
                .then(({data}) => {
                    setMessageList(data);
                });

        listenMessagesRealTime((newMessage) => {
            setMessageList((list) => {
                return [newMessage, ...list];
            });
        });
    }, []);

    function handleNewMessage(newMessage) {
        const message = {
            de: logedUser,
            texto: newMessage
        };

        supabaseClient
                .from('mensagens')
                .insert([message])
                .then(({data}) => {
                    // setMessageList([data[0], ...messageList]);
                });

        setMessage('');
    }

    function handleDeleteMessage(messages, deleteMessage) {
        const index = messages.findIndex((m) => m.id === deleteMessage.id);
        messages[index].text = 'mensagem deletada';
        messages[index].italic = true;
        setMessageList([...messages]);
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(${appConfig.background.image})`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList messages={messageList} handleDeleteMessage={(handleDeleteMessage)}/>

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(event) => {
                                setMessage(event.target.value);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNewMessage(message);

                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker 
                            onStickerClick={(sticker) => handleNewMessage(`:sticker: ${sticker}`)}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}