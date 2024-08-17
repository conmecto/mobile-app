import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

const TermsItem = React.memo(() => {
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.header}>Terms of Service</Text>
      </View>
      
      <View>
        <View>
          <Text style={styles.sectionHeader}>Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to <Text style={styles.bold}>Conmecto's</Text> Terms and Conditions of Use. These Terms govern your use and access
            to our website (www.conmecto.com, including subdomains), Conmecto mobile applications (together, referred to in this Terms as our “Services”).
            Our Privacy Policy governs your use of our Services and explains how we collect, safeguard and disclose information that results from your use of our Services.
            {'\n\n'}
            Your agreement with us includes these Terms and our Privacy Policy (“Agreements”). By using our Services, you are agreeing to be bound by these Agreements.
            These terms may be updated periodically, and with continued use of our Services constitutes acceptance of the revised terms.
          </Text>

          <Text style={styles.sectionHeader}>AGE LIMITATION</Text>
          <Text style={styles.paragraph}>
            Services are intended only for access and use by individuals at least eighteen (18) years old.
            By accessing or using any of the Services at any time, you warrant and represent that you are at
            least eighteen (18) years of age and with the full authority, right, and capacity to
            enter into this agreement and abide by all of the terms and conditions of Terms.
            If you are not at least eighteen (18) years old, you are prohibited from both the access and
            usage of Services.
          </Text>

          <Text style={styles.sectionHeader}>CONTENT</Text>
          <Text style={styles.paragraph}>
            Content Restrictions: {'\n\n'}
            - Content that is illegal or encourages, promotes or incites any illegal activity, is harmful to minors. {'\n\n'}
            - Content that is defamatory or misleading information or infringes any third party’s rights (including, without limitation, intellectual property rights and privacy rights). {'\n\n'}
            - Content that is pornographic, nude, obscene, abusive, insulting, threatening, or promotes hate, violence or discrimination against individuals or groups based on attributes like race, religion, or sexual orientation. {'\n\n'}
            - Content that is unsolicited, repetitive, or irrelevant content or impersonates or intends to deceive or manipulate a person (including, without limitation, scams and inauthentic behaviour). {'\n\n'}
            - Content that contains any spyware, adware, viruses, corrupt files, or other malicious text or files or code designed to interrupt or damage our Services. {'\n\n'}
            Your Content (including but not limited to information, text, images, videos, audio) means the
            Content you upload, create or provide, you are responsible and liable for Your Content.
            You will indemnify, defend, release, and hold us harmless from any claims made in connection
            with Your Content.
            You agree that Your Content must comply with our Content Restrictions. {'\n\n'}
            You can report other User's Content if you think that Content does not comply with our Content Restrictions (Reported Content).
            Reported Content will be removed if it is found not complying with our Content Restrictions or violate the Terms of Services.
            Users right to use of our Services may be immediately terminated if that User's Content does not comply with our Content restrictions.
          </Text>

          <Text style={styles.sectionHeader}>YOUR RESPONSIBILITIES</Text>
          <Text style={styles.paragraph}>
            Your use of our Services must comply with all applicable laws, including without limitation,
            privacy laws, intellectual property laws, anti-spam laws, equal opportunity laws and
            regulatory requirements.
            You agree to use your real name, date of birth in creating your account and on your profile.
            You agree to use the Services in a safe, inclusive and respectful manner and adhere to our
            Terms at all times. {'\n\n'}
            Conmecto reserve the right to refuse Services, terminate accounts, remove or edit content in our sole discretion.
          </Text>

          <Text style={styles.sectionHeader}>PRIVACY AND DATA</Text>
          <Text style={styles.paragraph}>
            Please check our Privacy Policy for information regarding usage of your personal data.
            By using our Services You acknowledge that we may use data in accordance with our Privacy Policy.
          </Text>

          <Text style={styles.sectionHeader}>APP PERMISSIONS</Text>
          <Text style={styles.paragraph}>
            We may ask your Permissions to access (including but not limited to) your Location, Notifications, Push Notifications, Camera, Photos.
          </Text>

          <Text style={styles.sectionHeader}>INDEMNIFICATION</Text>
          <Text style={styles.paragraph}>
            You agree to defend, indemnify, and hold harmless the Operator, along with its affiliates, directors, officers, employees, agents, suppliers, and licensors, from any liabilities, losses, damages, or expenses, including reasonable attorney fees, arising from or related to any third-party claims, actions, disputes, or demands brought against them due to your Content, your use of the Application and Services, or any intentional misconduct on your part.
          </Text>

          <Text style={styles.sectionHeader}>LIMITATION OF LIABILITY</Text>
          <Text style={styles.paragraph}>
            To the fullest extent permitted by applicable law, Conmecto, its affiliates, directors, officers, employees, agents, suppliers, and licensors shall not be liable for any indirect, incidental, special, punitive, or consequential damages arising from or related to your use of the app, including but not limited to damages for loss of profits, data, goodwill, business opportunities, or any other intangible losses, even if Conmecto has been advised of the possibility of such damages. {'\n\n'}
            In no event shall the total liability of Conmecto and its affiliates, directors, officers, employees, agents, suppliers, or licensors exceed the amount you have paid to Conmecto in the one-month period immediately preceding the event giving rise to the claim or one dollar, whichever is greater. This limitation of liability is cumulative and not per incident. {'\n\n'}
            This limitation of liability applies regardless of the form of action, whether in contract, tort (including negligence), warranty, or otherwise, and even if the remedy fails of its essential purpose.
          </Text>

          <Text style={styles.sectionHeader}>CHANGES</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify this Agreement or its terms relating to the Application and Services at any time, effective upon posting of an updated version of this Agreement in the Application. When we do, we will revise the updated date at the bottom of this page. Continued use of the Application and Services after any such changes shall constitute your consent to such changes.
          </Text>

          <Text style={styles.sectionHeader}>ACKNOWLEDGEMENT</Text>
          <Text style={styles.paragraph}>
            BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM.
          </Text>

          <Text style={styles.sectionHeader}>CONTACT US</Text>
          <Text style={styles.paragraph}>
            Please contact us by email: contact@conmecto.com
          </Text>
        </View>
      </View>
      
      <View>
        <Text style={policyStyles.title}>Privacy Policy</Text>
      </View>

      <View>
        <Text style={policyStyles.paragraph}>
          Welcome to Conmecto Privacy Policy! This explains how we collect, store, protect, and share your information, and with whom we share it. Conmecto operates www.conmecto.com (and other subdomains of conmecto.com), Conmecto mobile applications (together, referred to in this Privacy Policy as our “Services”), we collect some information about you. Our Privacy Policy explains how we collect, safeguard and disclose information that results from your use of our Services. Please read this privacy notice carefully as it will help you understand what we do with the information that we collect.
        </Text>

        <Text style={policyStyles.subtitle}>COLLECTION AND USE OF YOUR INFORMATION</Text>
        <Text style={policyStyles.paragraph}>
          When you download the Conmecto App, the App collects necessary information for the functionality and features like for creating your account or login to your account on the App, content you create and consume within the App. Your data is not shared with any other parties unless you consent to such sharing, or as required by law. We may disclose information if required by law or if we, in good faith, believe that such disclosure is necessary to comply with legal obligations or to protect our rights, safety, or property.
        </Text>

        <Text style={policyStyles.paragraph}>
          <Text style={policyStyles.bold}>Personal Information:</Text> Name, Email address, Date of birth, Location are used for account creation, management, communication. Additional Profile Or Personal Information such as Gender identity, Photographs, Sexual preference, About summary (including, but not limited to) may be asked for personalized experience of the App. Necessary App Access may be asked such as GeoLocation, Photo Library, Camera, Notification (including, but not limited to) to implement App features.
        </Text>

        <Text style={policyStyles.paragraph}>
          <Text style={policyStyles.bold}>Service Providers:</Text> We may share information with third-party service providers who help us operate our Services. These vendors are contractually bound to use your information only for the purposes we outline and are dedicated to safeguarding your privacy.
        </Text>

        <Text style={policyStyles.paragraph}>
          <Text style={policyStyles.bold}>Usage Information:</Text> Conmecto uses the collected data for: personalized experience of our Services for you, relevant notifications or communication, analysis so that we can improve our Services for your experience.
        </Text>

        <Text style={policyStyles.subtitle}>AGE POLICY</Text>
        <Text style={policyStyles.paragraph}>
          Our Services is intended for use by individuals who are 18 years of age or older. By using our services, you confirm that you meet this age requirement. We do not knowingly collect or solicit personal information from individuals under the age of 18. If we become aware that we have collected personal information from someone under 18, we will take steps to delete that information promptly.
        </Text>

        <Text style={policyStyles.subtitle}>COOKIES POLICY</Text>
        <Text style={policyStyles.paragraph}>
          Our app currently uses JWT tokens for authentication and does not use cookies for tracking or data storage. However, we may use similar technologies in the future, and we are committed to informing our users about any changes to our data collection practices.
        </Text>

        <Text style={policyStyles.subtitle}>RETENTION OF DATA</Text>
        <Text style={policyStyles.paragraph}>
          We will retain your Personal Data to operate and improve our services, to comply with legal obligations, resolve disputes, or enforce agreements. Even after you remove information from your profile or delete your Account, copies of that information may still be viewable and/or accessed to the extent such information has been previously shared with others, or copied or stored by others.
        </Text>

        <Text style={policyStyles.subtitle}>CHANGES TO THIS POLICY</Text>
        <Text style={policyStyles.paragraph}>
          We may update this privacy notice from time to time. Any updates will be posted on this page with a revised effective date. We encourage you to review this policy periodically to stay informed about how we are protecting your information.
        </Text>

        <Text style={policyStyles.subtitle}>Contact Us</Text>
        <Text style={policyStyles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us by email: contact@conmecto.com
        </Text>
      </View>
    </ScrollView>
  );
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default TermsItem;

const policyStyles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  lastUpdated: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});