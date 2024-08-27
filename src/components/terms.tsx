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