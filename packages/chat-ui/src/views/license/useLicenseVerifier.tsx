import React from "react";
import ChatLicenseInfo from "../utils/ChatLicenseInfo";
import CHAT_LICENSE_STATUS from "./ChatLicenseStatus";
import ChatLicenseError from "./ChatLicenseError";
import CHAT_LICENSING_MODELS from "./ChatLicensingModels";
import CHAT_LICENSE_SCOPES from "./ChatLicenseScopes";

// Данные которые нужно менять для каждой версии
const releaseInfo = 'MTcxODkyMDgwMDAwMA==';
const acceptedScopes = ['pro', 'premium'];

const useLicenseVerifier = () => {
  const licenseKey = ChatLicenseInfo.getLicenseKey();
  const [licenseStatus, setLicenseStatus] = React.useState<CHAT_LICENSE_STATUS>(CHAT_LICENSE_STATUS.Valid);

  const validateLicense = () => {
    if (!licenseKey) {
      setLicenseStatus(CHAT_LICENSE_STATUS.NotFound);
      return;
    }

    const licenseInfo = decodeKey(licenseKey);

    if (!licenseInfo.licensingModel || !CHAT_LICENSING_MODELS.includes(licenseInfo.licensingModel)) {
      console.error('Chat UI: Error checking license. Licensing model not found or invalid!');
      setLicenseStatus(CHAT_LICENSE_STATUS.Invalid)
      return;
    }
    if (!licenseInfo.expiryTimestamp) {
      console.error('Chat UI: Error checking license. Expiry timestamp not found or invalid!');
      setLicenseStatus(CHAT_LICENSE_STATUS.Invalid)
      return;
    }
    if (licenseInfo.licensingModel === 'perpetual' || process.env.NODE_ENV === 'production') {
      const pkgTimestamp = parseInt(window.atob(releaseInfo), 10);
      if (Number.isNaN(pkgTimestamp)) {
        console.error('Chat UI: The release information is invalid. Not able to validate license.');
      }
      if (licenseInfo.expiryTimestamp < pkgTimestamp) {
        setLicenseStatus(CHAT_LICENSE_STATUS.ExpiredVersion)
        return;
      }
    }
    if (licenseInfo.licensingModel === 'subscription' || licenseInfo.licensingModel === 'annual') {
      if (new Date().getTime() > licenseInfo.expiryTimestamp) {
        if (new Date().getTime() < licenseInfo.expiryTimestamp + 1000 * 3600 * 24 * 30 || process.env.NODE_ENV !== 'development') {
          setLicenseStatus(CHAT_LICENSE_STATUS.ExpiredAnnualGrace)
          return;
        }
        setLicenseStatus(CHAT_LICENSE_STATUS.ExpiredAnnual)
        return;
      }
    }
    if (!licenseInfo.scope || !CHAT_LICENSE_SCOPES.includes(licenseInfo.scope)) {
      console.error('Chat UI: Error checking license. scope not found or invalid!');
      setLicenseStatus(CHAT_LICENSE_STATUS.Invalid)
      return;
    }
    if (!acceptedScopes.includes(licenseInfo.scope)) {
      setLicenseStatus(CHAT_LICENSE_STATUS.OutOfScope)
      return;
    }

    setLicenseStatus(CHAT_LICENSE_STATUS.Valid);
  }

  React.useEffect(() => {
    validateLicense();
  }, []);

  const licenseError = React.useMemo(() => ChatLicenseError[licenseStatus], [licenseStatus]);

  return { licenseStatus, licenseError }
};

export default useLicenseVerifier;

const decodeKey = (encodedKey: string) => {
  const licenseInfo = {
    scope: '',
    licensingModel: '',
    expiryTimestamp: 0,
    planVersion: 'initial'
  };

  const base64 = encodedKey.slice(32);
  const decodedKey = window.atob(base64);

  decodedKey.split(',').map(token => token.split('=')).filter(el => el.length === 2).forEach(([key, value]) => {
    if (key === 'S') {
      licenseInfo.scope = value;
    }
    if (key === 'LM') {
      licenseInfo.licensingModel = value;
    }
    if (key === 'E') {
      const expiryTimestamp = parseInt(value, 10);
      if (expiryTimestamp && !Number.isNaN(expiryTimestamp)) {
        licenseInfo.expiryTimestamp = expiryTimestamp;
      }
    }
    if (key === 'PV') {
      licenseInfo.planVersion = value;
    }
  });

  return licenseInfo;
};
