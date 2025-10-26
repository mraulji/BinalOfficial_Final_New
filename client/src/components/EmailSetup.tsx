import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ExternalLink, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EmailSetup() {
  const [config, setConfig] = useState({
    serviceId: '',
    templateIdContact: '',
    templateIdBudget: '',
    publicKey: '',
    toEmail: '',
  });
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard!` });
  };

  const contactTemplate = `Subject: New Contact Message from {{from_name}}

Hi,

You have received a new contact message through your website:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Message:
{{message}}

---
Reply directly to this email to respond to the customer.`;

  const budgetTemplate = `Subject: New Budget Request from {{from_name}} - {{total_amount}}

Hi,

You have received a new budget request through your website:

CUSTOMER INFORMATION:
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Event Date: {{event_date}}

SELECTED SERVICES:
{{services}}

TOTAL AMOUNT: {{total_amount}}

ADDITIONAL NOTES:
{{additional_notes}}

---
Reply directly to this email to respond to the customer.`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Setup Steps:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Create a free account at EmailJS</li>
              <li>Add an email service (Gmail/Outlook)</li>
              <li>Create two email templates using the templates below</li>
              <li>Update the configuration in your code</li>
              <li>Test the forms!</li>
            </ol>
          </div>

          <Button
            onClick={() => window.open('https://www.emailjs.com', '_blank')}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Go to EmailJS Website
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Contact Form Template</Label>
            <Textarea
              value={contactTemplate}
              readOnly
              rows={8}
              className="text-xs"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(contactTemplate, 'Contact template')}
            >
              <Copy className="h-3 w-3 mr-2" />
              Copy Template
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Budget Request Template</Label>
            <Textarea
              value={budgetTemplate}
              readOnly
              rows={10}
              className="text-xs"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(budgetTemplate, 'Budget template')}
            >
              <Copy className="h-3 w-3 mr-2" />
              Copy Template
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Update these values in <code>src/lib/emailService.ts</code> file with your actual EmailJS credentials.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Service ID</Label>
              <Input
                value={config.serviceId}
                onChange={(e) => setConfig({...config, serviceId: e.target.value})}
                placeholder="service_xxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label>Public Key</Label>
              <Input
                value={config.publicKey}
                onChange={(e) => setConfig({...config, publicKey: e.target.value})}
                placeholder="xxxxxxxxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Template ID</Label>
              <Input
                value={config.templateIdContact}
                onChange={(e) => setConfig({...config, templateIdContact: e.target.value})}
                placeholder="template_xxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label>Budget Template ID</Label>
              <Input
                value={config.templateIdBudget}
                onChange={(e) => setConfig({...config, templateIdBudget: e.target.value})}
                placeholder="template_xxxxxxx"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Email Address</Label>
            <Input
              value={config.toEmail}
              onChange={(e) => setConfig({...config, toEmail: e.target.value})}
              placeholder="your-business@gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Code to Update</Label>
            <Textarea
              value={`// Update in src/lib/emailService.ts
export const EMAIL_CONFIG = {
  SERVICE_ID: '${config.serviceId}',
  TEMPLATE_ID_CONTACT: '${config.templateIdContact}',
  TEMPLATE_ID_BUDGET: '${config.templateIdBudget}',
  PUBLIC_KEY: '${config.publicKey}',
  TO_EMAIL: '${config.toEmail}',
};`}
              readOnly
              rows={8}
              className="text-xs"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(`export const EMAIL_CONFIG = {
  SERVICE_ID: '${config.serviceId}',
  TEMPLATE_ID_CONTACT: '${config.templateIdContact}',
  TEMPLATE_ID_BUDGET: '${config.templateIdBudget}',
  PUBLIC_KEY: '${config.publicKey}',
  TO_EMAIL: '${config.toEmail}',
};`, 'Configuration code')}
            >
              <Copy className="h-3 w-3 mr-2" />
              Copy Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}