

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PreviewProps {
  backColor: string;
  textColor: string;
  candidateTextColor: string;
  hilitedCandidateTextColor: string;
  hilitedCandidateBackColor: string;
  commentTextColor: string;
  labelColor: string;
  borderColor?: string;
  cornerRadius?: number;
  fontFace?: string;
  fontSize?: number;
  isLinear?: boolean;
}

export function ColorSchemePreview(props: PreviewProps) {
  const {
    backColor,
    candidateTextColor,
    hilitedCandidateTextColor,
    hilitedCandidateBackColor,
    commentTextColor,
    labelColor,
    borderColor,
    cornerRadius = 7,
    fontFace = 'system-ui',
    fontSize = 16,
    isLinear = false,
  } = props;

  const candidates = [
    { label: '1.', text: '你好', comment: 'nǐ hǎo', hilited: true },
    { label: '2.', text: '年好', comment: 'nián hǎo', hilited: false },
    { label: '3.', text: '拟好', comment: 'nǐ hǎo', hilited: false },
    { label: '4.', text: '逆号', comment: 'nì hào', hilited: false },
    { label: '5.', text: '你号', comment: 'nǐ hào', hilited: false },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">实时预览</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center py-4">
          <div
            className="shadow-lg"
            style={{
              backgroundColor: backColor,
              borderRadius: cornerRadius,
              border: borderColor ? `1px solid ${borderColor}` : undefined,
              fontFamily: fontFace,
              fontSize,
              padding: '8px 10px',
              minWidth: isLinear ? 400 : 200,
            }}
          >
            <div className={isLinear ? 'flex gap-4' : 'space-y-1'}>
              {candidates.map((c) => (
                <div
                  key={c.label}
                  className={cn(
                    'flex items-baseline gap-1.5 px-1.5 py-0.5',
                    isLinear ? '' : ''
                  )}
                  style={
                    c.hilited
                      ? {
                          backgroundColor: hilitedCandidateBackColor,
                          borderRadius: Math.max(cornerRadius - 2, 0),
                          color: hilitedCandidateTextColor,
                        }
                      : { color: candidateTextColor }
                  }
                >
                  <span
                    style={{
                      color: c.hilited ? hilitedCandidateTextColor : labelColor,
                      fontSize: fontSize - 2,
                    }}
                  >
                    {c.label}
                  </span>
                  <span>{c.text}</span>
                  <span
                    style={{
                      color: commentTextColor,
                      fontSize: fontSize - 2,
                    }}
                  >
                    {c.comment}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
