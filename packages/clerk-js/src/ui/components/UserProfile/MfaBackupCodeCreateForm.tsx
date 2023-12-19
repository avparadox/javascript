import { useUser } from '@clerk/shared/react';
import type { BackupCodeResource } from '@clerk/types';
import React from 'react';

import { Button, descriptors, localizationKeys, Text } from '../../customizables';
import {
  FormButtonContainer,
  FormContent,
  FullHeightLoader,
  useCardState,
  withCardStateProvider,
} from '../../elements';
import { useActionContext } from '../../elements/Action/ActionRoot';
import { handleError } from '../../utils';
import { MfaBackupCodeList } from './MfaBackupCodeList';
import { UserProfileBreadcrumbs } from './UserProfileNavbar';

export const MfaBackupCodeCreateForm = withCardStateProvider(() => {
  const { user } = useUser();
  const { close } = useActionContext();
  const card = useCardState();
  const [backupCode, setBackupCode] = React.useState<BackupCodeResource | undefined>(undefined);

  React.useEffect(() => {
    if (backupCode) {
      return;
    }

    void user
      ?.createBackupCode()
      .then((backupCode: BackupCodeResource) => setBackupCode(backupCode))
      .catch(err => handleError(err, [], card.setError));
  }, []);

  if (card.error) {
    return (
      <FormContent
        headerTitle={localizationKeys('userProfile.backupCodePage.title')}
        Breadcrumbs={UserProfileBreadcrumbs}
      />
    );
  }

  return (
    <FormContent
      headerTitle={localizationKeys('userProfile.backupCodePage.title')}
      Breadcrumbs={UserProfileBreadcrumbs}
    >
      {!backupCode ? (
        <FullHeightLoader />
      ) : (
        <>
          <Text localizationKey={localizationKeys('userProfile.backupCodePage.successMessage')} />

          <MfaBackupCodeList
            subtitle={localizationKeys('userProfile.backupCodePage.subtitle__codelist')}
            backupCodes={backupCode.codes}
          />

          <FormButtonContainer>
            <Button
              autoFocus
              onClick={close}
              localizationKey={localizationKeys('userProfile.formButtonPrimary__finish')}
              elementDescriptor={descriptors.formButtonPrimary}
            />
          </FormButtonContainer>
        </>
      )}
    </FormContent>
  );
});