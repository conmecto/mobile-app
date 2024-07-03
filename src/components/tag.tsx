import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { COLOR_CODE } from '../utils/enums';

const TagItem = ({ tag, tagColor }: { tag: string, tagColor: string }) => {
    return (
        <View style={[TagsStyles.tagContainer, { backgroundColor: tagColor }]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={TagsStyles.tagText}>{tag}</Text>
        </View>
    );
}

const TagsStyles = StyleSheet.create({
    tagContainer: { margin: 2, padding: 5, borderRadius: 5 },
    tagText: { fontSize: 10, color: COLOR_CODE.OFF_WHITE, fontWeight: '600' }
});

export default TagItem;