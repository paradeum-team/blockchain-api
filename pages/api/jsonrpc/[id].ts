import { NextApiHandler } from "next";

import { getChainJsonRpc } from "../../../helpers";

const handler: NextApiHandler = (req, res) => {
  const { id } = req.query;
  try {
    const data = getChainJsonRpc(id.toString());
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export default handler;
