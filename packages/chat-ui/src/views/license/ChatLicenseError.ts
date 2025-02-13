import LICENSE_STATUS from "./ChatLicenseStatus";

const ChatLicenseError: {[key in LICENSE_STATUS]: string} = {
  [LICENSE_STATUS.Invalid]: 'Invalid license key',
  [LICENSE_STATUS.NotFound]: 'Missing license key',
  [LICENSE_STATUS.OutOfScope]: 'License key out of scope',
  [LICENSE_STATUS.ExpiredAnnual]: 'License key expired',
  [LICENSE_STATUS.ExpiredAnnualGrace]: 'License key expired (grace period)',
  [LICENSE_STATUS.ExpiredVersion]: 'License key expired (version)',
  [LICENSE_STATUS.NotAvailableInInitialProPlan]: 'License key not available in initial pro plan',
  [LICENSE_STATUS.Valid]: 'Valid license key',
}

export default ChatLicenseError;
