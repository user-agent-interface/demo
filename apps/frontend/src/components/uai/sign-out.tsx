import { component, schema } from '@uai/client';
import { X, LogOut } from 'lucide-react';

export const signOut = component({
  description: 'Sign out from the application',
  inputSchema: schema.object({}),
  outputSchema: schema.object({
    signedOut: schema.boolean(),
  }),
  component: function SignOut({ componentOutput, setComponentOutput }) {
    const handleConfirm = () => {
      setComponentOutput({ signedOut: true });
    };

    const handleCancel = () => {
      setComponentOutput('cancelled');
    };

    return (
      <div className="flex flex-col">
        {/* Buttons */}
        <div className="flex items-center justify-end gap-2">
          {(!componentOutput || componentOutput === 'cancelled') && (
            <button
              type="button"
              disabled={!!componentOutput}
              onClick={handleCancel}
              className={`flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-4 py-2 text-sm transition-colors ${
                componentOutput === 'cancelled'
                  ? 'cursor-default opacity-50 text-muted-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          )}
          {componentOutput !== 'cancelled' && (
            <button
              type="button"
              disabled={!!componentOutput}
              onClick={handleConfirm}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                componentOutput
                  ? 'bg-primary/20 text-primary cursor-default'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          )}
        </div>
      </div>
    );
  },
});
