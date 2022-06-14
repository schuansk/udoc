import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handle(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const id = request.query.id;
  const { slug, title, content, documentationId } = request.body;
  if (request.method === 'POST') {
    const documentation = await prisma.documentation.upsert({
      where: {
        id: documentationId,
      },
      update: {
        title,
        content,
        slug,
      },
      create: {
        macroId: String(id),
        title,
        content,
        slug,
      },
    });
    return response.json(documentation);
  } else if (request.method === 'GET') {
    const id = request.query.id;
    const documentation = await prisma.documentation.findUnique({
      where: {
        id: String(id),
      },
    });
    return response.json(documentation);
  } else if (request.method === 'DELETE') {
    const deleteDocumentation = await prisma.documentation.delete({
      where: {
        id: String(id),
      },
    });
    return response.json(deleteDocumentation);
  } else {
    throw new Error(
      `The HTTP ${request.method} method is not supported at this route.`,
    );
  }
}
