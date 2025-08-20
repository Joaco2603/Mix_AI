export function generateConversationTitle(messages: Array<{ content: string; role: string }>): string {
  // Find the first user message
  const firstUserMessage = messages.find((msg) => msg.role === "user")

  if (!firstUserMessage) {
    return ""
  }

  const content = firstUserMessage.content.trim()

  // If message is short enough, use it as is
  if (content.length <= 40) {
    return content
  }

  // Extract key topics/keywords for longer messages
  const words = content.split(" ")

  // Try to create a meaningful title from the first few words
  if (words.length <= 6) {
    return content
  }

  // For longer messages, take first 5-6 words and add ellipsis
  const shortTitle = words.slice(0, 6).join(" ")
  return shortTitle.length > 40 ? shortTitle.substring(0, 37) + "..." : shortTitle + "..."
}
