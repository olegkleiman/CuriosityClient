import React, { Component } from 'react'
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


export class Demo extends Component {

    constructor() {
        super();
        this.state = {
            messageList: [{
                author: 'them',
                type: 'text',
                data: {
                    text: 'הי איך אני יכול לעזור?'
                }
            },
            ]
        };
    }

    _onMessageWasSent(message) {
        this.setState({
            messageList: [...this.state.messageList, message]
        })
    }

    _sendMessage(text) {
        if (text.length > 0) {
            this.setState({
                messageList: [...this.state.messageList, {
                    author: 'them',
                    type: 'text',
                    data: { text }
                }]
            })
        }
    }

    render() {
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
                onMessageWasSent={this._onMessageWasSent.bind(this)}
                messageList={this.state.messageList}
                showEmoji
            />
        </div>)
    }
}