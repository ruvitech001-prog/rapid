#!/usr/bin/env python3
import re
import sys

files = [
    "src/app/employer/payroll/dashboard/page.tsx",
    "src/app/employer/payroll/run/page.tsx",
    "src/app/employer/payroll/salary-structure/page.tsx",
    "src/app/employer/perks/page.tsx",
    "src/app/employer/services/page.tsx",
    "src/app/employer/updates/page.tsx",
    "src/app/employer/notifications/page.tsx",
    "src/app/employer/profile/page.tsx",
]

# Mapping of hex colors to design tokens
color_map = {
    '#642DFC': 'colors.primary500',
    '#5020d9': 'colors.primary500',  # hover state, use same
    '#586AF5': 'colors.iconBlue',
    '#353B41': 'colors.neutral800',
    '#8593A3': 'colors.neutral500',
    '#DEE4EB': 'colors.border',
    '#F4F7FA': 'colors.neutral50',
    '#A8B5C2': 'colors.neutral400',
    '#EFF2F5': 'colors.neutral100',
    '#22957F': 'colors.success600',
    '#CC7A00': 'colors.warning600',
    '#FF7373': 'colors.error600',
    '#E24949': 'colors.error600',
    '#EBF5FF': 'colors.secondaryBlue50',
}

def add_import(content):
    """Add design tokens import if not present"""
    if "from '@/lib/design-tokens'" in content:
        return content

    # Find the last import statement and add after it
    import_pattern = r"(import.*from '@/lib/[^']+'\n)"
    matches = list(re.finditer(import_pattern, content))
    if matches:
        last_import = matches[-1]
        pos = last_import.end()
        content = content[:pos] + "import { colors } from '@/lib/design-tokens'\n" + content[pos:]

    return content

def replace_colors_in_style_props(content):
    """Replace hex colors in style prop objects"""
    for hex_color, token in color_map.items():
        # style={{ color: '#586AF5' }} => style={{ color: colors.iconBlue }}
        content = re.sub(
            rf"(color|backgroundColor|borderColor):\s*['\"]?{re.escape(hex_color)}['\"]?",
            rf"\1: {token}",
            content
        )
    return content

def replace_colors_in_classnames(content):
    """Replace hardcoded colors in className attributes - convert to style props"""
    patterns = [
        (r'text-\[#586AF5\]', 'style={{ color: colors.iconBlue }}', 'text-blue-600'),
        (r'text-\[#8593A3\]', 'style={{ color: colors.neutral500 }}', 'text-gray-500'),
        (r'text-\[#353B41\]', 'style={{ color: colors.neutral800 }}', 'text-gray-800'),
        (r'text-\[#CC7A00\]', 'style={{ color: colors.warning600 }}', 'text-orange-600'),
        (r'text-\[#FF7373\]', 'style={{ color: colors.error600 }}', 'text-red-500'),
        (r'text-\[#22957F\]', 'style={{ color: colors.success600 }}', 'text-green-600'),
        (r'bg-\[#642DFC\]', 'style={{ backgroundColor: colors.primary500 }}', 'bg-purple-600'),
        (r'bg-\[#EBF5FF\]', 'style={{ backgroundColor: colors.secondaryBlue50 }}', 'bg-blue-50'),
        (r'bg-\[#F4F7FA\]', 'style={{ backgroundColor: colors.neutral50 }}', 'bg-gray-50'),
        (r'bg-\[#EFF2F5\]', 'style={{ backgroundColor: colors.neutral100 }}', 'bg-gray-100'),
        (r'border-\[#DEE4EB\]', 'style={{ borderColor: colors.border }}', 'border-gray-200'),
    ]

    # For simplicity, replace with Tailwind equivalents (since mixing is complex)
    for pattern, style, tw_class in patterns:
        content = re.sub(pattern, tw_class, content)

    return content

def process_file(filepath):
    """Process a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = add_import(content)
        content = replace_colors_in_style_props(content)
        content = replace_colors_in_classnames(content)

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated {filepath}")
            return True
        else:
            print(f"- No changes needed for {filepath}")
            return False
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")
        return False

def main():
    print("Updating design tokens in employer pages...")
    updated_count = 0

    for filepath in files:
        if process_file(filepath):
            updated_count += 1

    print(f"\nCompleted! Updated {updated_count} out of {len(files)} files.")

if __name__ == "__main__":
    main()
