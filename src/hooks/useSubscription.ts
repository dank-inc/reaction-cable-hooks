import { useActionCableContext } from "contexts/ActionCable";
import ActionCable from "actioncable";
import { useEffect, useState } from "react";

type Props<ChannelDataSchema> = {
  channel: string;
  params: Record<string, string>;
  // event handler for recieving channel data
  received: (data: ChannelDataSchema) => void;
  // Send data across the channel

  onConnected?: () => void;
  debug: boolean;
};

type SubscriptionResponse<ChannelDataSchema> =
  | {
      subscription: ActionCable.Channel;
      send: (data: ChannelDataSchema) => boolean;
      ensureActiveConnection: () => void;
    }
  | {
      subscription: null;
    };

// Socket data = the data you expect in return from the channel
export const useSubscription = <ChannelDataSchema>({
  channel,
  params,
  received,
  onConnected,
  debug,
}: Props<ChannelDataSchema>): SubscriptionResponse => {
  const [subscription, setSubscription] = useState<ActionCable.Channel | null>(
    null
  );

  const { consumer } = useActionCableContext();

  useEffect(() => {
    const subscription = consumer.subscriptions.create(
      { channel, ...params },
      {
        received,
      }
    );
    if (debug) console.info("Subscribed to", channel);
    if (onConnected) onConnected();

    setSubscription(subscription);

    return () => {
      if (debug) console.info("Unsubscribing from", channel);
      subscription.unsubscribe();
    };
  }, [channel, consumer.subscriptions, debug, onConnected, params, received]);

  return subscription === null
    ? {
        subscription: null,
      }
    : {
        subscription,
        ensureActiveConnection: consumer.ensureActiveConnection,
        send: subscription.send,
      };
};
