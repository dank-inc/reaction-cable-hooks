# React action cable (with hooks!)

a fun little action cable library.

Made with 💖 and TypeScript!

# The Context

after creatng your channels in rails, use the context provider to connect to your rails app:

the provider takes the following properties:

## Props

```ts
type ProviderProps = {
  url?: string; // optional
  LoadingComponent: JSX.Element; // Shown while connecting
  devMode?: boolean;
};
```

## Context Provider

```ts
import { ActionCableProvider } from 'reaction-cable-hooks'

<ActionCableProvider {...props}>
  <YourApp>
</ActionCableProvider>
```

# The Hook

### Props

```ts
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
```

### Usage

```tsx
import { useSubscription } from "reaction-cable-hooks";

const YourComponent = () => {
  const handleChannelUpdate = (data: SubscriptionResponse) => {
    // do somehing with the response
    console.log("channel update recieved", data)
  };

  const connection = useSubscription<SubscriptionResponse>({
    channel: "SomeActionCableChannel",
    params: { userId: "some-user-id" },
    received: handleChannelUpdate,
  });

  const handleClick = () => {
    if(connection.subscription)
      connection.send({ message: "Hello SomeActionCableChannel!" })
  }

  return <div>
    <button onClick={handleClick}>
  </div>
};
```
