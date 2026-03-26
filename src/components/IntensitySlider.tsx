import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Layout } from '../utils/theme/DesignSystem';

const { width } = Dimensions.get('window');

const LEVELS = [
  { value: 1, label: 'Subtle', desc: 'Light touch' },
  { value: 2, label: 'Mild', desc: 'Soft style' },
  { value: 3, label: 'Normal', desc: 'Balanced' },
  { value: 4, label: 'Strong', desc: 'Bold effect' },
  { value: 5, label: 'Max', desc: 'Full clipart' },
];

interface Props {
  value: number; // 1-5
  onChange: (v: number) => void;
}

export const IntensitySlider: React.FC<Props> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      {/* Track */}
      <View style={styles.trackWrap}>
        {LEVELS.map((lvl, idx) => {
          const isActive = lvl.value <= value;
          const isCurrent = lvl.value === value;
          return (
            <TouchableOpacity
              key={lvl.value}
              onPress={() => onChange(lvl.value)}
              style={styles.segmentBtn}
              activeOpacity={0.7}
            >
              {/* Bar segment */}
              <View
                style={[
                  styles.segment,
                  isActive && styles.segmentActive,
                  isCurrent && styles.segmentCurrent,
                  idx === 0 && styles.segmentFirst,
                  idx === LEVELS.length - 1 && styles.segmentLast,
                ]}
              />
              {/* Dot on current */}
              {isCurrent && <View style={styles.dot} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Labels row */}
      <View style={styles.labelsRow}>
        <Text style={styles.labelMin}>Subtle</Text>
        <View style={styles.currentLabel}>
          <Text style={styles.currentValue}>{LEVELS[value - 1].label}</Text>
          <Text style={styles.currentDesc}>{LEVELS[value - 1].desc}</Text>
        </View>
        <Text style={styles.labelMax}>Max</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 4,
    paddingBottom: 4,
  },
  trackWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 36,
  },
  segmentBtn: {
    flex: 1,
    height: 36,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  segment: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
  },
  segmentActive: {
    backgroundColor: 'rgba(208, 149, 255, 0.45)',
  },
  segmentCurrent: {
    backgroundColor: Colors.primary,
    height: 10,
  },
  segmentFirst: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  segmentLast: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  dot: {
    position: 'absolute',
    top: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  labelMin: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  labelMax: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  currentLabel: {
    alignItems: 'center',
  },
  currentValue: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  currentDesc: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
});
