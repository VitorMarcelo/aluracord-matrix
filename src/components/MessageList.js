import { Box, Text, Image, Button } from '@skynexui/components';
import appConfig from '../../config.json';

export function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.messages.map((message) => {
                return (
                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            color: appConfig.theme.colors.neutrals[(message.italic ? '300' : '000')],
                            fontStyle: (message.italic ? 'italic' : 'normal'),
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${message.de}.png`}
                            />
                            <Text tag="strong"
                                styleSheet={{
                                    fontStyle: 'normal',
                                    color: appConfig.theme.colors.neutrals['000']
                                }}
                            >
                                {message.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                            <Button
                                onClick={()=> {props.handleDeleteMessage(props.messages, message)}}
                                variant='tertiary'
                                colorVariant='negative'
                                label='Deletar'
                            />
                        </Box>
                        {message.texto.startsWith(':sticker:') ? (
                            <Image src={message.texto.replace(':sticker:', '').trim()} 
                            styleSheet={{
                                maxWidth: '100px'
                            }}/>
                        ) : (
                            message.texto
                        )}
                    </Text>
                );
            })}

        </Box>
    )
}