export const authError = (response, message) =>
  response.status(401)
    .json({ error: message});

export const serverError = (response, error) =>
  response.status(500)
    .json({ error: error.message });

export const deleteSuccess = (response) =>
  response.status(204)
    .json({});

export const badRequest = (response, message) =>
  response.status(400)
    .json({ error: message });

export const notFoundError = (response, message) =>
  response.status(404)
    .json({ error: message });

export const responseOk = (response, data) =>
  response.status(200)
    .json(data);

export const responseCreateOk = (response, data) =>
  response.status(201)
    .json(data);
