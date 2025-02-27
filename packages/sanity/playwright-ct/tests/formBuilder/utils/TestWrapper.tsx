import {type SanityClient} from '@sanity/client'
import {Card, LayerProvider, studioTheme, ThemeProvider, ToastProvider} from '@sanity/ui'
import {type ReactNode, Suspense, useEffect, useState} from 'react'
import {
  ColorSchemeProvider,
  ResourceCacheProvider,
  type SchemaTypeDefinition,
  SourceProvider,
  UserColorManagerProvider,
  type Workspace,
  WorkspaceProvider,
} from 'sanity'
import {Pane, PaneContent, PaneLayout} from 'sanity/structure'

import {createMockSanityClient} from '../../../../test/mocks/mockSanityClient'
import {getMockWorkspace} from '../../../../test/testUtils/getMockWorkspaceFromConfig'

/**
 * @description This component is used to wrap all tests in the providers it needs to be able to run successfully.
 * It provides a mock Sanity client and a mock workspace.
 */
export const TestWrapper = ({
  children,
  schemaTypes,
}: {
  children?: ReactNode
  schemaTypes: SchemaTypeDefinition[]
}) => {
  const [mockWorkspace, setMockWorkspace] = useState<Workspace | null>(null)

  useEffect(() => {
    const getWorkspace = async () => {
      const client = createMockSanityClient() as unknown as SanityClient
      const config = {
        name: 'default',
        projectId: 'test',
        dataset: 'test',
        schema: {
          types: schemaTypes,
        },
      }
      const workspace = await getMockWorkspace({client, config})
      setMockWorkspace(workspace)
      return workspace
    }

    getWorkspace()
  }, [schemaTypes])

  if (!mockWorkspace) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <ThemeProvider theme={studioTheme}>
        <ToastProvider>
          <LayerProvider>
            <WorkspaceProvider workspace={mockWorkspace}>
              <ResourceCacheProvider>
                <SourceProvider source={mockWorkspace.unstable_sources[0]}>
                  <ColorSchemeProvider>
                    <UserColorManagerProvider>
                      <PaneLayout height="fill">
                        <Pane id="test-pane">
                          <PaneContent>
                            <Card padding={3}>{children}</Card>
                          </PaneContent>
                        </Pane>
                      </PaneLayout>
                    </UserColorManagerProvider>
                  </ColorSchemeProvider>
                </SourceProvider>
              </ResourceCacheProvider>
            </WorkspaceProvider>
          </LayerProvider>
        </ToastProvider>
      </ThemeProvider>
    </Suspense>
  )
}
