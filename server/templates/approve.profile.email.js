const approveProfileMail = userName => {
  const mailTitle = 'Diaspora Invest: Approved Account';
  const message = `<p>Dear ${userName}, Your account has being approved successfully, you can now start using our platform</a>.</p>`;
  const mailBody = `<!DOCTYPE html><html><head><title>Message</title></head><body>${message}</body></html>`;

  return {
    mailBody,
    mailTitle
  };
};

module.exports = approveProfileMail;
