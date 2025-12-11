'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import React from 'react';

export interface StepIOCardProps {
  label: string;
  data: any;
}

export function StepIOCard({ label, data }: StepIOCardProps) {
  const [copied, setCopied] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  if (!data) return null;
  const json = JSON.stringify(data, null, 2);
  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Extract summary fields to display in the table
  const summaryFields = React.useMemo(() => {
    if (typeof data !== 'object' || data === null) return [];
    // Show up to 4 most relevant fields based on common keys
    const keys = Object.keys(data);
    const important = [
      'name',
      'title',
      'status',
      'version',
      'result',
      'error',
      'patchFile',
      'qaBuildPath',
      'testResults',
      'coverage',
      'reportPath',
      'id',
      'qNumber',
      'releaseDate',
      'vendorSeverity',
    ];
    const picked = important.filter((k) => keys.includes(k));
    const rest = keys.filter((k) => !picked.includes(k));
    return [...picked, ...rest].slice(0, 4);
  }, [data]);

  return (
    <Card className='bg-muted border'>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between mb-2'>
          <Label className='text-sm font-medium text-muted-foreground'>{label}</Label>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='text-xs'>
              {typeof data === 'object' && data !== null
                ? Object.keys(data).length + ' fields'
                : 'Raw'}
            </Badge>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleCopy}
              title='Copy JSON'
              aria-label='Copy JSON'
            >
              <Copy className='w-4 h-4' />
            </Button>
            {copied && <span className='text-xs text-green-500 ml-1'>Copied!</span>}
          </div>
        </div>
        {/* Summary Table */}
        <div className='mb-2'>
          <table className='w-full text-xs'>
            <tbody>
              {summaryFields.map((key) => (
                <tr key={key}>
                  <td
                    className='pr-2 font-medium text-muted-foreground align-top'
                    style={{ width: '120px' }}
                  >
                    {key}
                  </td>
                  <td className='text-foreground align-top'>
                    {typeof data[key] === 'object' && data[key] !== null ? (
                      <span className='italic text-muted-foreground'>[object]</span>
                    ) : (
                      String(data[key])
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='mb-2'
          onClick={() => setShowDetails((v) => !v)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
        {showDetails && (
          <pre
            className={`text-sm font-mono text-muted-foreground p-3 
            bg-background rounded border max-h-64 overflow-auto whitespace-pre-wrap break-all`}
          >
            {json}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
