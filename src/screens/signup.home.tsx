import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { Button, Checkbox, Modal, Portal, Provider } from 'react-native-paper';
import { COLOR_CODE } from '../utils/enums';
//import findNumber from '../api/find.number';
import findEmail from '../api/find.email';
import TopBar from '../components/top.bar';
import environments from '../utils/environments';
import { getToken } from '../utils/helpers';

type SignupObj = {
  country: string,
  email?: string,
  name?: string,
  appleAuthToken?: string,
  termsAccepted?: boolean,
  appleAuthUserId?: string,
  deviceToken?: string
}

FontAwesome.loadFont();

const { height, width } = Dimensions.get('window');

const SignupHomeScreen = ({ navigation }: any) => {
  //const numberRegex = new RegExp(/^[0-9]*$/);
  //const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  //const extension = '+91';
  const [signupObj, setSignupObj] = useState<SignupObj>({ country: 'india' });
  const [signupError, setSignupError] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);

  const onPressTerms = () => {
    setSignupObj({ ...signupObj, termsAccepted: !signupObj.termsAccepted })
  }

  useEffect(() => {
    let check = true;
    const callEmailCheck = async () => {
      const res = await findEmail(signupObj.email as string);
      if (check) {
        setEmailCheck(false);
        if (res?.userId) {
          setSignupObj({ country: 'india' });
          setSignupError('This email already exists, please login instead');
        }
      }
    }
    if (emailCheck) {
      callEmailCheck();
    }
    return () => {
      check = false;
    }
  }, [emailCheck]);

  const onPressNextHandler = () => {
    let error = '';
    if (!signupObj.email || !signupObj.appleAuthToken) {
      error = 'Please sign in with email access';
    }
    if (!signupObj.termsAccepted) {
      error = 'Please read and accept the Term and Conditions';
    }
    if (error) {
      setSignupError(error);
    } else {
      navigation.navigate('SignupSecondScreen', { signupObj: JSON.stringify(signupObj) });
    }
  }
  const onAppleButtonPress = async () => {
    try {
      if (signupObj.appleAuthToken) {
        return;
      }
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
      });
      if (!appleAuthRequestResponse.email) {
        setSignupError('Please allow email access for signin');
      } else if (!appleAuthRequestResponse.identityToken) {
        throw new Error();
      } else {
        let name = '';
        if (appleAuthRequestResponse.fullName?.givenName) {
          name += appleAuthRequestResponse.fullName?.givenName;
          if (appleAuthRequestResponse.fullName?.familyName) {
            name += (' ' + appleAuthRequestResponse.fullName?.familyName);
          }
          name = name.toLowerCase();
        }
        const deviceTokenObj = await getToken('deviceToken');
        setSignupObj({ 
          ...signupObj, 
          appleAuthToken: appleAuthRequestResponse.identityToken, 
          email: appleAuthRequestResponse.email,
          name,
          appleAuthUserId: appleAuthRequestResponse.user,
          ...(deviceTokenObj ? { deviceToken: deviceTokenObj.password } : {})
        });
        setSignupError('');
        setEmailCheck(true);
      }
    } catch(error) {
      if (environments.appEnv !== 'prod') {
        console.log('Apple sign in error', error);
      }
      setSignupError('Something went wrong, please retry');
    }
  }

  return (
    <View style={{ flex: 1 }}>  
      <TopBar />
      <Provider>
        <Portal>
          <Modal visible={showTerms} onDismiss={() => setShowTerms(false)} contentContainerStyle={styles.modalContainer}>
            <ScrollView>
              <Text style={{ padding: 10 }}>
                These Terms of Service (“Terms”, “Terms of Service”) govern your use and access to our websites located at www.conmecto.com.  Our Privacy Policy governs your use of our Services and explains how we collect, safeguard and disclose information that results from your use of our websites.
                Your agreement with us includes these Terms and our Privacy Policy (“Agreements”). By using our Services, you are agreeing to be bound by these Agreements. These Agreements apply to all visitors, users and others who wish to access or use our Services. If you do not agree with (or cannot comply with) the Agreements, then you may not use our Services. Please let us know by emailing at admin@conmecto.com so we can try to find a solution. 
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>Content and Conduct{'\n'}</Text>
                Our Services allow you to post, link, store, scan, share and otherwise make available certain information, text, forms, graphics, files, or other material (“Content”). When you use our Services, you provide us access to these Content. These Terms do not give us any rights to your Content except for the limited rights that enable us to offer our Services. 
                By transmitting Content on or through our Services, you represent and warrant that: (i) Content is yours (you own it) and/or you have the right to use it and (ii) that the posting of your Content on or through Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity. We reserve the right to terminate the account of anyone found to be infringing on a copyright. 
                Conmecto does not review any user generated content on our site unless you give us consent to. You are responsible for ensuring all Content transmitted through our Services are not in violation of any laws and do not wrongfully infringe upon the intellectual property of others. 
                Any Content submitted through Conmecto is at the discretion of its users. If at any time a requestor or recipient of Conmecto Services does not feel comfortable submitting content through Conmecto, they have the right to coordinate an alternative means to submit the information outside of Conmecto. Requestors of information and file completion through the Conmecto platform shall not make Conmecto the only option to submit requested files and information.
                You retain any and all of your rights to any Content you submit, post or transmit on or through Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third party transmits or stores on or through Service. 
                However, we need your permission to do things like hosting your Content, backing it up, and sharing it when you ask us to. Our Services also provide you with features like tracking, commenting, sharing, searching, OCR scanning, image thumbnails, document previews, sorting and organization, storage, and other customized functions to help reduce clutter and ensure quality. To provide these and other features, Conmecto accesses and stores your Content. You hereby give us permission to do those things, and this permission extends to our affiliates and trusted third parties we work with. 
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>Disclaimer</Text>
                {'\n'}
                Conmecto may occasionally provide self-service draft templates for client use. Our templates are content intended for private use only. They do not constitute legal advice. We do not review any information you provide us, nor do we offer any opinions, legal or otherwise, regarding the information you provide. Use of our website does not constitute an attorney-client relationship. 
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>Your Responsibilities</Text>
                {'\n'}
                Your use of our Services must comply with all applicable laws, including intellectual property laws, publicity laws, contract laws, export control laws and regulations. Content in the Services may be protected by others’ intellectual property rights. Please do not copy, upload, download, or share content unless you have the right to do so. Conmecto may review your conduct and content for compliance with these Terms. We are not responsible for the content people upload and share via our Services. 
                You are responsible to back up your Content. Conmecto is not responsible for any loss of data due to any failure to back up your Content. 
                You must be at least 18 years of age to use our Services. 
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>Account Registration </Text>
                {'\n'}
                When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times.
                Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on Service. 
                You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password, whether your password is with our Service or a third-party service. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account. 
                You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you, without appropriate authorization. You may not use as a username any name that is offensive, vulgar or obscene. 
                We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in our sole discretion. 
                <Text style={{ fontWeight:'bold' }}>Authorized Users </Text>
                In connection with use of your Account, you may authorize others (“Authorized User(s)”) to use the Services on your behalf. Each Authorized User will create and make use of a username and password. You are responsible for keeping the username and password confidential and ensure that they are not disclosed to any third party. You are responsible for any act or omission of your Authorized Users. Conmecto is not responsible for activities that occur under your Account using your username and password, including any loss or deletion of your Content. You acknowledge that your Authorized Users have full access and management privileges of your Account(s), any personal data associated with your Account, and your Content. 
                Conmecto reserves the right to terminate or suspend your Account, or the access of any Authorized User, for any reason, including if any registration information is inaccurate, untrue or incomplete, or if any Authorized User fails to maintain the security of any access credentials. 
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>Communications </Text>
                {'\n'}
                By creating an Account to use our Services, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing at admin@conmecto.com . 
                <Text style={{ fontWeight:'bold' }}>Subscriptions Or Charges</Text>
                {'\n'}
                At the moment our services does not offer any subscription and you are not charged for using our services.
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>Prohibited Uses </Text>
                {'\n'}
                You agree to not misuse our Service or help anyone else do so. You may use our Services only for lawful purposes and in accordance with these Terms. For example, the following uses are strictly prohibited: 
                {'\n'}
                (a) In any way that violates any applicable national or international law or regulation. 
                {'\n'}
                (b) For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise. 
                {'\n'}
                (c) To transmit, or procure the sending of, any advertising or promotional material, including any “junk mail”, “chain letter,” “spam,” or any other similar solicitation. 
                {'\n'}
                (d) To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity. 
                {'\n'}
                (e) In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity. 
                {'\n'}
                (f) To engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of Service, or which, as determined by us, may harm or offend Company or users of Service or expose them to liability. 
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>Additionally, you agree not to: </Text>
                {'\n'}
                (a) Use Service in any manner that could disable, overburden, damage, or impair Service or interfere with any other party’s use of Service, including their ability to engage in real time activities through Service. 
                {'\n'}
                (b) Use any robot, spider, or other automatic device, process, or means to access Service for any purpose, including monitoring or copying any of the material on Service. 
                {'\n'}
                (c) Use any manual process to monitor or copy any of the material on our Services or for any other unauthorized purpose without our prior written consent. 
                {'\n'}
                (d) Use any device, software, or routine that interferes with the proper working of Service. 
                {'\n'}
                (e) Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful. 
                {'\n'}
                (f) Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of Service, the server on which Service is stored, or any server, computer, or database connected to Service. 
                {'\n'}
                (g) Attack Service via a denial-of-service attack or a distributed denial-of-service attack. 
                {'\n'}
                (h) Take any action that may damage or falsify Company rating. 
                {'\n'}
                (i) Probe, scan, or test the vulnerability of our system or network. 
                {'\n'}
                (j) Breach or otherwise circumvent any security or authentication measures. 
                {'\n'}
                (k) Otherwise attempt to interfere with or reverse engineering the proper working of Service. 
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>No Use By Minors</Text>
                {'\n'}
                Service is intended only for access and use by individuals at least eighteen (18) years old. By accessing or using any of the Company, you warrant and represent that you are at least eighteen (18) years of age and with the full authority, right, and capacity to enter into this agreement and abide by all of the terms and conditions of Terms. If you are not at least eighteen (18) years old, you are prohibited from both the access and usage of Service. 
                <Text style={{ fontWeight:'bold' }}>Intellectual Property </Text>
                Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Conmecto Inc. and its licensors. Service is protected by copyright, trademark, and other laws of the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Conmecto Inc. 
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>Copyright Policy</Text> 
                {'\n'}
                We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on Service infringes on the copyright or other intellectual property rights (“Infringement”) of any person or entity. 
                {'\n'}
                If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim via email to admin@conmecto.com.
                You may be held accountable for damages (including costs and attorneys&#x27; fees) for misrepresentation or bad-faith claims on the infringement of any Content found on and/or through Service on your copyright. 
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>Termination</Text>
                {'\n'}
                We may terminate or suspend your account and bar access to our Services immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of Terms. 
                If you wish to terminate your account, you may simply discontinue using our Services. 
                All provisions of Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability. Termination of an account may result in losing access to files and information stored on our system. 
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>User Data</Text> 
                {'\n'}
                Conmecto will maintain certain data that you transmit to our websites for the purpose of managing the performance of our Services, as well as data relating to your use of the websites. Although we perform regular backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using our Services. Conmecto has no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of data. 
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>Acknowledgement</Text>
                {'\n'}
                BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM.
                {'\n'}
                <Text style={{ fontWeight:'bold' }}>Contact Us</Text>
                Please send your feedback, comments, requests for technical support: By email: admin@conmecto.com.
              </Text>
            </ScrollView>
          </Modal>
        </Portal>
        <View style={styles.container}>          
          <View style={styles.signinContainer}>
            <Text style={styles.errorTextStyle} numberOfLines={1} adjustsFontSizeToFit>{signupError}</Text>
            <Text>{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}</Text>
            <AppleButton 
              buttonStyle={AppleButton.Style.BLACK}
              buttonType={AppleButton.Type.SIGN_IN}
              style={{
                width: width * 0.5,
                height: height * 0.07
              }}
              onPress={() => onAppleButtonPress()}
            />
          </View>
          <View style={styles.termsContainer}>
            <View style={styles.termsCheckBox}>
              <Checkbox
                status={signupObj.termsAccepted ? 'checked' : 'unchecked'}
                onPress={onPressTerms}
                color={COLOR_CODE.BRIGHT_BLUE}
              />
            </View>
            <View>
              <Button mode='text' onPress={() => setShowTerms(true)} textColor={COLOR_CODE.GREY} labelStyle={styles.termsText}>
                Terms and Conditions
              </Button>
            </View>
          </View>
          <View style={styles.nextContainer}>
            <Button mode='outlined' onPress={onPressNextHandler} labelStyle={styles.nextButtonText}>Next</Button>
          </View>
        </View>
      </Provider>
    </View>
  )
}

export default SignupHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_CODE.OFF_WHITE
  },

  signinContainer: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    //paddingBottom: 50,
    //borderWidth: 1
  },

  termsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    //borderWidth: 1
  },

  nextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
    //borderWidth: 1
  },

  modalContainer: { 
    backgroundColor: COLOR_CODE.OFF_WHITE, 
    height: height * 0.6, 
    width: width * 0.8, 
    alignSelf: 'center', 
    borderRadius: 20 
  },

  termsText: { 
    textDecorationLine: 'underline', 
    fontWeight: 'bold' 
  },

  errorTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLOR_CODE.BRIGHT_RED
  },

  termsCheckBox: { 
    transform: [{ scale: 0.8 }], 
    borderWidth: 0.5, 
    borderRadius: 50 
  },

  nextButtonText: {
    color: COLOR_CODE.BRIGHT_BLUE
  }
});
