import { Artifact } from '@/components/create-artifact';
import { ReportDocument } from '@/components/report-document';

interface CustomArtifactMetadata {
  // Define metadata your custom artifact might need—the example below is minimal.
  documentId: string;
  info: string;
}

export const customArtifact = new Artifact<'report', CustomArtifactMetadata>({
  kind: 'report',
  description: 'A custom artifact for data analysis and reporting',
  // Initialization can fetch any extra data or perform side effects
  initialize: async ({ documentId, setMetadata }) => {
    // For example, initialize the artifact with default metadata.
    setMetadata({
      documentId,
      info: `Document ${documentId} initialized.`,
    });
  },
  // Handle streamed parts from the server (if your artifact supports streaming updates)
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    // @ts-ignore
    if (streamPart.type === 'info-update') {
      setMetadata((metadata) => ({
        ...metadata,
        info: streamPart.content as string,
      }));
    }
    // @ts-ignore
    if (streamPart.type === 'content-update') {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: draftArtifact.content + (streamPart.content as string),
        status: 'streaming',
      }));
    }
  },
  // Defines how the artifact content is rendered
  content: (args) => {
    const {
      mode,
      status,
      content,
      isCurrentVersion,
      currentVersionIndex,
      onSaveContent,
      getDocumentContentById,
      isLoading,
      metadata,
    } = args;
    if (isLoading) {
      return <div>Loading custom artifact...</div>;
    }
    console.log('document metadata:', args);

    if (mode === 'diff') {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);
      return (
        <div>
          <h3>Diff View</h3>
          <pre>{oldContent}</pre>
          <pre>{newContent}</pre>
        </div>
      );
    }
    if (!metadata?.documentId) {
      return null;
    }

    return (
      <div className="custom-artifact">
        <ReportDocument
          id={metadata.documentId}
          type="document"
          source={content}
        />
      </div>
    );
  },
  // An optional set of actions exposed in the artifact toolbar.
  actions: [
    {
      icon: <span>⟳</span>,
      description: 'Refresh artifact info',
      // @ts-ignore
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Please refresh the info for my custom artifact.',
        });
      },
    },
  ],
  // Additional toolbar actions for more control
  toolbar: [
    {
      icon: <span>✎</span>,
      description: 'Edit custom artifact',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Edit the custom artifact content.',
        });
      },
    },
  ],
});
