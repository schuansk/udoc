import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handle(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'GET') {
    const macros = await prisma.macro.findMany({
      include: {
        documentation: true,
      },
    });

    return response.json(macros);
  } else if (request.method === 'POST') {
    const { title, slug } = request.body;

    const macro = await prisma.macro.create({
      data: {
        title,
        slug,
      },
    });

    return response.json(macro);
  } else {
    throw new Error(
      `The HTTP ${request.method} method is not supported at this route.`,
    );
  }
}
