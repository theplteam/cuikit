import React from "react";
import { useChatContext } from "./../../views/core/ChatGlobalContext";

export enum LICENSE_STATUS {
  missing,
  invalid,
  expired,
  valid,
};

const errorMessages = {
  [LICENSE_STATUS.missing]: 'Your license key is missing',
  [LICENSE_STATUS.invalid]: 'Your license was invalid',
  [LICENSE_STATUS.expired]: 'Your license was expired',
  [LICENSE_STATUS.valid]: '',
};

const testRequest = (_licenseKey: string | undefined): Promise<LICENSE_STATUS> => new Promise((resolve) => setTimeout(() => resolve(LICENSE_STATUS.invalid), 1000));

const useLicenseVerifier = () => {
  const { licenseKey } = useChatContext();
  const [licenseStatus, setLicenseStatus] = React.useState<LICENSE_STATUS>(LICENSE_STATUS.valid);

  const validateLicense = async () => {
    if (!licenseKey) {
      setLicenseStatus(LICENSE_STATUS.missing);
      return
    }

    const newStatus = await testRequest(licenseKey);
    if (newStatus === licenseStatus) return;

    setLicenseStatus(newStatus);
  }

  React.useEffect(() => {
    validateLicense();
    const interval = setInterval(() => {
      validateLicense();
    }, 1 * 60 * 60 * 1000);

    return () => clearInterval(interval)
  }, []);

  const licenseError = errorMessages[licenseStatus];

  return { licenseStatus, licenseError }
}

export default useLicenseVerifier;