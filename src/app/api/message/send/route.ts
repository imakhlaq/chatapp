export async function POST(req: Request) {
  try {
    const { text, chatId } = await req.json();
  } catch (e) {}
}
