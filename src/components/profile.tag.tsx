import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { COLOR_CODE } from '../utils/enums';

const ProfileTagItem = ({ tag, tagColor, borderRadius }: { tag: string, tagColor: string, borderRadius: number }) => {
    return (
        <View style={[TagsStyles.tagContainer, { backgroundColor: tagColor, borderRadius }]}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={TagsStyles.tagText}>{tag}</Text>
        </View>
    );
}

const TagsStyles = StyleSheet.create({
    tagContainer: { margin: 2, padding: 5 },
    tagText: { fontSize: 15, color: COLOR_CODE.OFF_WHITE, fontWeight: 'bold' }
});

export default ProfileTagItem;