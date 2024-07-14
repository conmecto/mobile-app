import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { COLOR_CODE } from '../utils/enums';

type FixedPromptResponseParams = {
    prompt: string
}

const FixedPromptResponse = ({ prompt }: FixedPromptResponseParams) => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.promptHeaderContainer}>
                <View style={styles.promptContainer}>
                    <Text style={styles.promptText}>
                        {prompt}
                    </Text>
                </View>
            </View>
            <View style={styles.responseMainContainer}>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1 },
    promptHeaderContainer: { flex: 0, justifyContent: 'center', alignItems: 'flex-start' },
    promptContainer: {
        borderWidth: 0.5,
        backgroundColor: COLOR_CODE.WHITE,
        borderColor: COLOR_CODE.LIGHT_GREY,
        borderRadius: 10,
        padding: 10,
        margin: 4,
    },
    promptText: { fontSize: 15, fontWeight: 'bold', color: COLOR_CODE.BLACK },
    responseMainContainer: { flex: 1 }
});

export default FixedPromptResponse;