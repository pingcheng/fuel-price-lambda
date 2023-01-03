type BuildErrorResponseConfig = {
  message: string;
};
export const buildErrorResponse = ({ message }: BuildErrorResponseConfig) => {
  const response = {
    response_type: "ephemeral",
    text: message,
  };

  console.log(`Built error response`, response);

  return response;
};
