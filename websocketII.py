import asyncio
import websockets

async def echo(websocket, path):
    try:
        async for message in websocket:
            print(f"Received message: {message}")
            # Echo the received message back to the client
            await websocket.send(f"Echo: {message}")
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Connection closed: {e}")

async def main():
    async with websockets.serve(echo, "localhost", 5501):
        print("Server listening on ws://localhost:")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())