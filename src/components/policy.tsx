import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';

const PolicyItem = React.memo(() => {
  return (
    <ScrollView style={policyStyles.maincontainer}>      
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

const policyStyles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 20,
  },
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

export default PolicyItem;
