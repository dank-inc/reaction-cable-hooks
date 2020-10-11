import React, { createContext, useContext, useState, useEffect } from "react";
import ActionCable from "actioncable";

type Props = {
  children: React.ReactNode;
  url?: string;
  LoadingComponent: JSX.Element;
};

type Context = {
  consumer: ActionCable.Cable;
};

const ActionCableContext = createContext<Context | null>(null);

export const ActionCableProvider = ({
  children,
  LoadingComponent,
  url,
}: Props) => {
  const [consumer, setConsumer] = useState<ActionCable.Cable | null>(null);

  useEffect(() => {
    const consumer = url
      ? ActionCable.createConsumer(url)
      : ActionCable.createConsumer();
    consumer.connect();
    console.info("Action cable consumer connected");
    setConsumer(consumer);

    return () => {
      consumer.disconnect();
    };
  }, []);

  return consumer ? (
    <ActionCableContext.Provider value={{ consumer }}>
      {children}
    </ActionCableContext.Provider>
  ) : (
    LoadingComponent
  );
};

export const useActionCableContext = () => {
  const context = useContext(ActionCableContext);

  if (!context)
    throw new Error(
      "ActionCableContext must be called from within its Provider"
    );

  return context;
};
