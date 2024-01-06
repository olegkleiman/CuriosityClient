import React, { Component, useEffect, useState } from 'react'
import { Launcher } from 'react-chat-window'


const Rtl = () => (
    <style>
        {`
    .sc-user-input--text {
        border-bottom-left-radius: unset;
        border-bottom-right-radius: 10px;
        line-height: 1.3;
    }

    .sc-user-input--send-icon {
        scale: -1 1;
    }

    .sc-user-input--buttons {
        right: unset;
        left: 10px;
    }


    .sc-popup-window--cointainer {
        right: unset;
        left: 100px;
    }




    .sc-popup-window--cointainer:after {
        right: unset;
        left: 28px;
        transform: rotate(-45deg);
    }



    .sc-popup-window--search {
        padding-left: unset;
        padding-right: 25px;
        background-position: 100% 12px;
    }


    .sc-message--avatar {
        margin-right: unset;
        margin-left: 15px;
    }



    .sc-message--content.received .sc-message--text {
        margin-right: unset;
        margin-left: 40px;
    }

    .sc-message--file p {
        margin: 0px 10px 0px 0px;
    }



    .sc-launcher {
        right: unset;
        left: 25px;
    }


    .sc-launcher .sc-open-icon,
    .sc-launcher .sc-closed-icon {
        right: unset;
        left: 25px;
    }



    .sc-launcher.opened .sc-open-icon {
        transform: rotate(90deg);
    }

    .sc-launcher.opened .sc-closed-icon {
        transform: rotate(90deg);
        opacity: 0;
    }


    .sc-new-messages-count {
        left: unset;
        right: 41px;
        box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }



    .sc-header--close-button {
        margin-right: unset;
        margin-left: 10px;
    }



    .sc-chat-window {
        right: unset;
        left: 25px;
    }


    .sc-message--me {
        text-align: left;
    }


    .sc-message--them {
        text-align: right;
    }




    .sc-chat-window {
        right: unset;
        left: 0px;
    }



    @media (max-width: 450px) {
        .sc-chat-window {
            right: unset;
            left: 0px;
        }

    }
    `}
    </style>
)

async function* makeTextFileLineIterator(q, h = [], signal) {
    const utf8Decoder = new TextDecoder("utf-8");
    const response = await fetch(`http://localhost:7071/api/Chat?q=${q}&h=${JSON.stringify(h)}`,
    {
        signal,
        method: "GET",
    });
    let reader = response.body.getReader();
    let { value: chunk, done: readerDone } = await reader.read();
    chunk = chunk ? utf8Decoder.decode(chunk, { stream: true }) : "";

    let re = /\r\n|\n|\r/gm;
    let startIndex = 0;

    for (; ;) {
        let result = re.exec(chunk);
        if (!result) {
            if (readerDone) {
                break;
            }
            let remainder = chunk.substr(startIndex);
            ({ value: chunk, done: readerDone } = await reader.read());
            chunk =
                remainder + (chunk ? utf8Decoder.decode(chunk, { stream: true }) : "");
            startIndex = re.lastIndex = 0;
            continue;
        }
        yield chunk.substring(startIndex, result.index);
        startIndex = re.lastIndex;
    }
    if (startIndex < chunk.length) {
        // last line didn't end in a newline char
        yield chunk.substr(startIndex);
    }
}

export function ChatWindow() {

    const [messageList, setMessageList] = useState([{
        author: 'them',
        type: 'text',
        data: {
            text: 'הי איך אני יכול לעזור?'
        }
    }])

    const [serverMsg, setServerMsg] = useState(null)

    const [q, setQ] = useState("")


    useEffect(() => {
        if (!q)
            return;

        const abortController = new AbortController();
        const signal = abortController.signal;
        const fetchData = async () => {
            try {
                const history = messageList.map((m) => ({
                    Role: 
                        {
                            Label: m.author == 'them' ? 'assistant' : "user"
                        },
                    Content: m.data.text
                }))
                for await (let rowLine of makeTextFileLineIterator(q, history, signal)) {
                    if (!Boolean(rowLine.length)) {
                        continue;
                    }
                    const line = rowLine.replace(/^data: /gm, "")
                    if (line == "[DONE]") {
                        setServerMsg(null)
                    }
                    else {
                        const chunk = JSON.parse(line)
                        //const content = chunk.choices[0]?.delta?.content;
                        const content = chunk.Content;
                        if (!content) continue;
                        setMessageList((prev => {
                            const newArray = [...prev];
                            const lastValue = newArray[newArray.length - 1];
                            if (!lastValue || lastValue.author != 'them') {
                                newArray.push({
                                    author: 'them',
                                    type: 'text',
                                    data: {
                                        text: content
                                    }
                                })
                            } else {
                                newArray[newArray.length - 1] = {
                                    author: 'them',
                                    type: 'text',
                                    data: {
                                        text: lastValue?.data?.text + content
                                    }
                                }
                            }
                            return newArray;
                        }))
                        setServerMsg((prev) => prev ? content : prev + content)
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }

        fetchData();

        return () => {
            // Abort the fetch request when the component is unmounted
            abortController.abort();
        };
    }, [q])

    const _onMessageWasSent = (message) => {
        setMessageList((prev) => [...prev, message])
        if(message.data?.text)
            setQ(message.data?.text);
    }


    useEffect(() => {
        if (!serverMsg) {
            return;
        }
        else if (serverMsg == "[DONE]") {
            return;
        } else {
            console.log(serverMsg);
        }
    }, [serverMsg])
    // const _sendMessage = (text) => {
    //     if (text.length > 0) {
    //         this.setState({
    //             messageList: [...this.state.messageList, {
    //                 author: 'them',
    //                 type: 'text',
    //                 data: { text }
    //             }]
    //         })
    //     }
    // }

    return (<div>
        {true && Rtl()}
        <style>
            {`.sc-user-input--text {
                    line-height: 1.3;
                }`}
        </style>
        <Launcher
            style={{ direction: "ltr" }}
            agentProfile={{
                teamName: 'עיירית תל אביב',
                imageUrl: 'images/chat-icon.png'
            }}
            onMessageWasSent={_onMessageWasSent}
            messageList={messageList}
            showEmoji = {false}
        />
    </div>)

}