import { NextApiHandler } from "next";

import { getFilterOptions, getNamespaceList } from "../../../helpers";

const handler: NextApiHandler = (req, res) => {
  const { id } = req.query;
  try {
    let data = getNamespaceList(id.toString(), getFilterOptions(req));

    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export default handler;
