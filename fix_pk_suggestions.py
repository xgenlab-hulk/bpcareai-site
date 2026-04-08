#!/usr/bin/env python3
"""
修复建议关键词长度 - 确保所有建议都在30-50字符范围内
"""

import json

def fix_suggestion(item):
    """修复建议关键词，确保30-50字符"""
    suggested = item['suggested_keyword']
    length = len(suggested)

    if 30 <= length <= 50:
        return suggested  # Already good

    title = item['title'].lower()
    current_pk = item['current_keyword']

    # 如果太短，添加更多上下文
    if length < 30:
        words = suggested.split()

        # 添加管理/监测/策略词
        context_words = []
        if 'diabetes' in suggested or 'glucose' in suggested or 'insulin' in title:
            if 'management' not in suggested:
                context_words.append('management')
        elif 'hypertension' in suggested or 'blood pressure' in suggested or 'heart' in suggested:
            if 'monitoring' not in suggested:
                context_words.append('monitoring')
        elif 'holiday' in suggested or 'meal' in suggested:
            if 'meals' not in suggested:
                context_words.append('meals')

        # 如果还不够，添加场景词
        if len(' '.join(words + context_words)) < 30:
            if 'warning' in title or 'signs' in title:
                context_words.append('warning signs')
            elif 'prevent' in title or 'risk' in title:
                context_words.append('prevention')
            elif 'manage' in title or 'control' in title:
                if 'management' not in context_words:
                    context_words.append('strategies')
            elif 'diet' in title or 'food' in title:
                context_words.append('diet tips')

        # 组合
        new_suggestion = ' '.join(words + context_words)

        # 如果还是太短，从current_pk中提取关键词
        if len(new_suggestion) < 30:
            pk_words = current_pk.split()
            # 取前3-4个关键词
            extra_words = []
            for word in pk_words:
                if word not in new_suggestion and len(word) > 3:
                    extra_words.append(word)
                    if len(' '.join(words + context_words + extra_words)) >= 30:
                        break
            new_suggestion = ' '.join(words + context_words + extra_words)

        # 最终检查：确保至少30字符
        if len(new_suggestion) < 30:
            # 最后的fallback：使用title的关键部分
            if len(new_suggestion + ' diet management') <= 50:
                new_suggestion = new_suggestion + ' diet management'
            elif len(new_suggestion + ' health tips') <= 50:
                new_suggestion = new_suggestion + ' health tips'

        return new_suggestion[:50] if len(new_suggestion) > 50 else new_suggestion

    # 如果太长，缩短
    if length > 50:
        words = suggested.split()
        while len(' '.join(words)) > 50 and len(words) > 3:
            words.pop()
        return ' '.join(words)

    return suggested

def main():
    # 读取当前结果
    with open('/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/pk-check-result-3.json', 'r') as f:
        data = json.load(f)

    print(f"Processing {len(data['needs_optimization'])} suggestions...")

    # 修复每个建议
    fixed_count = 0
    for item in data['needs_optimization']:
        original = item['suggested_keyword']
        fixed = fix_suggestion(item)

        if original != fixed:
            fixed_count += 1
            item['suggested_keyword'] = fixed

            # 更新rationale
            old_len = len(original)
            new_len = len(fixed)
            if old_len < 30:
                item['rationale'] = f"Extended from {old_len} to {new_len} chars; " + item['rationale']

    # 验证所有建议
    all_valid = True
    invalid_items = []
    for item in data['needs_optimization']:
        length = len(item['suggested_keyword'])
        if length < 30 or length > 50:
            all_valid = False
            invalid_items.append({
                'slug': item['slug'][:50],
                'suggested': item['suggested_keyword'],
                'length': length
            })

    if all_valid:
        print(f"\n✓ All {len(data['needs_optimization'])} suggestions are now 30-50 chars!")
        print(f"✓ Fixed {fixed_count} suggestions")
    else:
        print(f"\n✗ Still have {len(invalid_items)} invalid suggestions:")
        for inv in invalid_items[:5]:
            print(f"  - \"{inv['suggested']}\" ({inv['length']} chars)")

    # 保存结果
    with open('/Users/hulksi/Desktop/IOS_APPS/bpcareai-site/data/pk-check-result-3.json', 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nResults saved to: data/pk-check-result-3.json")

if __name__ == '__main__':
    main()
