import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handle(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const id = request.query.id;
  if (request.method === 'DELETE') {
    const deleteMacro = await prisma.macro.delete({
      where: {
        id: String(id),
      },
    });
    return response.json(deleteMacro);
  } else {
    throw new Error(
      `The HTTP ${request.method} method is not supported at this route.`,
    );
  }
}
