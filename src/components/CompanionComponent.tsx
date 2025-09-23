"use client";

import { cn, configureAssistant, getSubjectColor } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import soundwaves from '@/constants/soundwaves.json';
import { Separator } from '@radix-ui/react-select';
import { addToSessionHistory } from '@/lib/actions/companion.actions';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface CompanionComponentProps {
    companionId: string;
    subject: string;
    topic: string;
    name: string;
    userName: string;
    userImage: string;
    style: string;
    voice: string;
}

const CompanionComponent = ({
    companionId,
    subject,
    topic,
    name,
    userName,
    userImage,
    style,
    voice,
}: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    useEffect(() => {
        if (lottieRef.current) {
            if (isSpeaking) {
                lottieRef.current?.play();
            } else {
                lottieRef.current?.stop();
            }
        }
    }, [isSpeaking]);

    const toggleMicrophone = async () => {
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted);
    };

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        const assistantOverrides: any = {
            variableValues: { subject, topic, style },
            clientMessages: ["transcript"],
            serverMessages: undefined,
        };
        try {
            vapi.start(configureAssistant(voice, style), assistantOverrides);
        } catch (err) {
            console.error('Exception during vapi.start():', err);
            setCallStatus(CallStatus.INACTIVE);
        }
    };


    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    };

    const onMessage = (message: Message) => {
        if (message.type === 'transcript' && message.transcriptType === 'final') {
            const newMessage = {
                role: message.role,
                content: message.transcript
            };

            setMessages((prev) => [newMessage, ...prev]);
        }
    };


    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            addToSessionHistory(companionId)
        }
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);
        const onError = (error: Error) => console.error('VAPI Error:', error);

        vapi.on('message', onMessage);
        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);

        return () => {
            vapi.off('message', onMessage);
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
        };
    }, []);

    return (
        <section className="flex flex-col h-[70vh]">
            <section className="flex gap-8 max-sm:flex-col">
                {/* Companion Section */}
                <div className="companion-section">
                    <div
                        className="companion-avatar relative"
                        style={{ backgroundColor: getSubjectColor(subject) }}
                    >
                        {/* Avatar Static Icon */}
                        <div
                            className={cn(
                                'absolute transition-opacity duration-1000',
                                callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                callStatus === CallStatus.CONNECTING && 'opacity-100 animate-pulse'
                            )}
                        >
                            <Image
                                src={`/icons/${subject}.svg`}
                                alt={subject}
                                width={150}
                                height={150}
                                className="max-sm:w-fit"
                            />
                        </div>

                        {/* Active Call Animation */}
                        <div
                            className={cn(
                                'absolute transition-opacity duration-1000',
                                callStatus === CallStatus.ACTIVE ? 'opacity-100' : 'opacity-0'
                            )}
                        >
                            <Lottie
                                lottieRef={lottieRef}
                                animationData={soundwaves}
                                autoplay={false}
                                className="companion-lottie"
                            />
                        </div>
                    </div>
                    <p className="font-bold text-2xl">{name}</p>
                </div>

                {/* User Section */}
                <div className="user-section">
                    <div className="user-avatar">
                        <Image src={userImage} alt={userName} width={130} height={130} className="rounded-lg" />
                        <p className="font-bold text-2xl">{userName}</p>
                    </div>

                    {/* Microphone Toggle */}
                    <button className="btn-mic flex items-center gap-2 mt-4" onClick={toggleMicrophone} disabled={callStatus !== CallStatus.ACTIVE}>
                        <Image
                            src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'}
                            alt="mic"
                            width={36}
                            height={36}
                        />
                        <p className="max-sm:hidden">{isMuted ? 'Turn on microphone' : 'Turn off microphone'}</p>
                    </button>

                    {/* Call/End Session Button */}
                    <button
                        className={cn(
                            'rounded-lg py-2 px-4 mt-4 cursor-pointer transition-colors w-full text-white',
                            callStatus === CallStatus.ACTIVE
                                ? 'bg-red-700'
                                : 'bg-primary',
                            callStatus === CallStatus.CONNECTING && 'animate-pulse'
                        )}
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                        disabled={callStatus === CallStatus.CONNECTING}
                    >
                        {callStatus === CallStatus.ACTIVE
                            ? 'End Session'
                            : callStatus === CallStatus.CONNECTING
                                ? 'Connecting...'
                                : 'Start Session'}
                    </button>
                </div>
            </section>
            <section className="transcript">
                {/* <div className="transcript-message no-scrollbar">
                    {messages.length === 0 && (
                        <p className="text-gray-500 text-center">No messages yet</p>
                    )}
                    {messages.map((message, index) => {
                        const key = `${message.role}-${index}`;
                        if (message.role === 'assistant') {
                            return (
                                <p key={key} className="max-sm:text-sm">
                                    {name
                                        .split(' ')[0]
                                        .replace(/[.,]/g, '')}
                                    : {message.content}
                                </p>

                            )
                        } else {
                            return (
                                <p key={key} className="text-primary max-sm:text-sm">
                                    {userName}: {message.content}
                                </p>
                            )
                        }
                    })}
                </div> */}

                <div className="transcript-message no-scrollbar">
                    {messages.length === 0 && (
                        <p className="text-gray-500 text-center">No messages yet</p>
                    )}
                    {/* {messages.map((message) => {
                        if (message.role === 'assistant') {
                            return (
                                <p key={message.content} className="max-sm:text-sm">
                                    {name
                                        .split(separator: ' ')[0]
                    .replace(searchValue: '/[.,]/g', replaceValue: '')}
                                    : {message.content}
                                </p>
                            )
                        } else {
                            return (
                                <p key={message.content} className="text-primary max-sm:text-sm">
                                    {userName}: {message.content}
                                </p>
                            )
                        }
                    })} */}
                    {messages.map((message) => {
                        if (message.role === 'assistant') {
                            return (
                                <p key={message.content} className="max-sm:text-sm">
                                    {name
                                        .split(' ')[0]
                                        .replace(/[.,]/g, '')}
                                    : {message.content}
                                </p>
                            )
                        } else {
                            return (
                                <p key={message.content} className="text-primary max-sm:text-sm">
                                    {userName}: {message.content}
                                </p>
                            )
                        }
                    })}

                </div>
                <div className="transcript-fade" />
            </section>
        </section>
    );
};

export default CompanionComponent;
