import os

from dotenv import load_dotenv

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import x_search

load_dotenv()

client = Client(api_key=os.getenv("XAI_API_KEY"))
# chat = client.chat.create(
#     model="grok-4-1-fast",  # reasoning model
#     tools=[web_search()],
#     include=["verbose_streaming"],
# )

# chat.append(user("What is xAI?"))

# is_thinking = True
# for response, chunk in chat.stream():
#     # View the server-side tool calls as they are being made in real-time
#     for tool_call in chunk.tool_calls:
#         print(f"\nCalling tool: {tool_call.function.name} with arguments: {tool_call.function.arguments}")
#     if response.usage.reasoning_tokens and is_thinking:
#         print(f"\rThinking... ({response.usage.reasoning_tokens} tokens)", end="", flush=True)
#     if chunk.content and is_thinking:
#         print("\n\nFinal Response:")
#         is_thinking = False
#     if chunk.content and not is_thinking:
#         print(chunk.content, end="", flush=True)

# print("\n\nCitations:")
# print(response.citations)
# print("\n\nUsage:")
# print(response.usage)
# print(response.server_side_tool_usage)
# print("\n\nServer Side Tool Calls:")
# print(response.tool_calls)

chat = client.chat.create(
    model="grok-4-1-fast",
    tools=[x_search(enable_image_understanding=True, enable_video_understanding=True)],
    include=["verbose_streaming"],
)

# System prompt
chat.append(
    user("You are an expert video scriptwriter. Generate a concise, engaging script for a short video (2-5 minutes) on the given topic. Structure it with: 1) Hook/Introduction, 2) 3-5 Key Points with details, 3) Call to Action/Conclusion. Use natural conversational language, keep total under 800 words. Format clearly with section headers.")
)

# User request
chat.append(user(f"Write a video script about: X"))

# Get response

is_thinking = True
for response, chunk in chat.stream():
    # View the server-side tool calls as they are being made in real-time
    for tool_call in chunk.tool_calls:
        print(f"\nCalling tool: {tool_call.function.name} with arguments: {tool_call.function.arguments}")
    if response.usage.reasoning_tokens and is_thinking:
        print(f"\rThinking... ({response.usage.reasoning_tokens} tokens)", end="", flush=True)
    if chunk.content and is_thinking:
        print("\n\nFinal Response:")
        is_thinking = False
    if chunk.content and not is_thinking:
        print(chunk.content, end="", flush=True)
        
        
print("\n\nCitations:")
print(response.citations)
print("\n\nUsage:")
print(response.usage)
print(response.server_side_tool_usage)
print("\n\nServer Side Tool Calls:")
print(response.tool_calls)