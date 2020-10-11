import { useActionCableContext } from "contexts/ActionCable";
import { useEffect, useState } from "react";

type Props<ChannelDataSchema> = {
  channel: string;
  params: Record<string, string>;
  // event handler for recieving channel data
  received: (data: ChannelDataSchema) => void;
  // Send data across the channel
  send?: (data: ChannelDataSchema) => boolean;
  onConnected?: () => void;
  debug: boolean;
};

type SubscriptionResponse = {
  connected: boolean;
  ensureActiveConnection: () => void;
};

// Socket data = the data you expect in return from the channel
export const useSubscription = <ChannelDataSchema>({
  channel,
  params,
  received,
  send,
  onConnected,
  debug,
}: Props<ChannelDataSchema>): SubscriptionResponse => {
  const [connected, setConnected] = useState(false);

  const { consumer } = useActionCableContext();

  useEffect(() => {
    const subscription = consumer.subscriptions.create(
      { channel, ...params },
      {
        received,
      }
    );
    if (debug) console.info("Subscribed to", channel);
    if (send) subscription.send = send;
    if (onConnected) onConnected();

    setConnected(true);

    return () => {
      if (debug) console.info("Unsubscribing from", channel);
      subscription.unsubscribe();
    };
  }, [
    channel,
    consumer.subscriptions,
    debug,
    onConnected,
    params,
    received,
    send,
  ]);

  return { connected, ensureActiveConnection: consumer.ensureActiveConnection };
};
