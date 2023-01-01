type BuildErrorResponseConfig = {
  message: string;
};
export const buildErrorResponse = ({ message }: BuildErrorResponseConfig) => {
  return {
    response_type: "ephemeral",
    text: message,
  };
};
